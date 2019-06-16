﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using IdentityProvider.Helpers;
using IdentityProvider.Models;
using IdentityProvider.Repositories;
using IdentityProvider.Repositories.Interfaces;
using IdentityProvider.Services.Interfaces;
using IdentityProvider.Utils;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace IdentityProvider.Services
{
    public class AccountService : IAccountService
    {
        private static Random _random = new Random();

        private readonly IAccountRepository _accountRepository = null;

        private readonly IOptions<AppSettings> _settings = null;
        private readonly IPublishToTopic _publishToTopic = null;

        public AccountService(IOptions<AppSettings> settings)
        {
            _accountRepository = new AccountRepository(settings);
            _publishToTopic = new PublishToTopic();
            _settings = settings;
        }

        public AccountService(IAccountRepository accountRepository, 
            IOptions<AppSettings> settings,
            IPublishToTopic publishToTopic)
        {
            _accountRepository = accountRepository;
            _publishToTopic = publishToTopic;
            _settings = settings;
        }

        public Account Authenticate(string email, string password)
        {
            var account = _accountRepository.GetByEmail(email);
            if (account != null)
            {
                var isValid = Hash.HashPassword(password, account.PasswordSalt) == account.Password;
                if (isValid)
                {
                    account.UserId = new BsonObjectId(ObjectId.GenerateNewId());
                    account.Token = JwtToken.Generate(_settings.Value.Secret, account);
                }
                // Set important fields to null
                account.Password = null;
                account.PasswordSalt = null;
            }

            return account;
        }

        public IEnumerable<Account> GetAll()
        {
            return _accountRepository.GetAll();
        }

        public Account Register(Account account)
        {
            if (_accountRepository.GetByEmail(account.Email) != null) return null;
            var salt = Salt.Generate();
            var encryptedAccount = new Account()
            {               
                Username = account.Username,
                Email = account.Email,
                Password = Hash.HashPassword(account.Password, salt),
                PasswordSalt = salt,
                Role = "unverified",
                UserId = new BsonObjectId(ObjectId.GenerateNewId()),
                Id=new BsonObjectId(ObjectId.GenerateNewId())
            };
            var result = _accountRepository.Add(encryptedAccount);

            // Generate token
            result.Token = JwtToken.Generate(_settings.Value.Secret, encryptedAccount);

            if(result != null)
            {
                Mail mail = new Mail()
                {
                    Subject = "Thanks for joining TripSharing",
                    To = result.Email,
                    Url = $"/api/identity/account/verify?token={result.Token}",
                    EmailType = "EmailConfirm"
                };

                _publishToTopic.PublishEmail(mail);
            }

            return result;
        }

        public bool ChangePassword(string accountId, string currentPassword, string newPassword)
        {
            var account = _accountRepository.Get(accountId);
            var salt = account.PasswordSalt;
            if (Hash.HashPassword(currentPassword, salt).Equals(account.Password))
            {
                string newEncryptedPassword = Hash.HashPassword(newPassword, salt);
                account.Password = newEncryptedPassword;
                var result = _accountRepository.Update(account);
                return result != null;
            }
            else
            {
                return false;
            }
        }

        public string GetResetPasswordToken(string email)
        {
            var account = _accountRepository.GetByEmail(email);
            var token = JwtToken.GenerateResetPasswordToken(_settings.Value.Secret, account);

            Mail mail = new Mail()
            {
                Subject = "Reset password",
                To = email,
                Url = $"/api/identity/account/resetpassword?token={token}",
                EmailType = "EmailResetPassword"
            };

            _publishToTopic.PublishEmail(mail);

            return token;
        }

        public string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 10)
              .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        public bool VerifyEmail(string id)
        {
            // get eq account and set role to member
            var account = _accountRepository.Get(id);
            account.Role = "member";
            // update account with member role
            return _accountRepository.Update(account) != null;
        }

        public bool ResetPassword(string accountId, string newPassword)
        {
            var account = _accountRepository.Get(accountId);
            var salt = account.PasswordSalt;
            string newEncryptedPassword = Hash.HashPassword(newPassword, salt);
            account.Password = newEncryptedPassword;
            var result = _accountRepository.Update(account);
            return result != null;

        }

        public GoogleUser GetGoogleUserInformation(string accessToken)
        {
            GoogleUser userInfo = null;
            string url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + accessToken + "";

            WebRequest request = WebRequest.Create(url);
            request.Credentials = CredentialCache.DefaultCredentials;
            using (var response = request.GetResponse())
            {
                using (var stream= response.GetResponseStream())
                {
                    using (var reader = new StreamReader(stream))
                    {
                        string result = reader.ReadToEnd();
                        userInfo = JsonConvert.DeserializeObject<GoogleUser>(result);
                    }
                }
            }
            return userInfo;            
        }

        public string GoogleAuthenticate (string accessToken)
        {
            var userInfo = GetGoogleUserInformation(accessToken);
            if (userInfo == null)
            {
                return null;
            }
            var user = _accountRepository.GetByEmail(userInfo.email);
            if (user != null)
            {
                return JwtToken.Generate(_settings.Value.Secret, user);
            }else
            {   
                var newAccount= new Account()
                {
                    Email = userInfo.email,
                    Password = null,
                    PasswordSalt = null,
                    Role = "member",
                    Username = userInfo.given_name,
                    UserId = new BsonObjectId(ObjectId.GenerateNewId())
                };
                _accountRepository.Add(newAccount);
                return JwtToken.Generate(_settings.Value.Secret, newAccount);
            }           
        }
        
    }
}
