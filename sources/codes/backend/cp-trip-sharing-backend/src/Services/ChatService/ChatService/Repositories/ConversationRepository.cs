﻿using ChatService.DbContext;
using ChatService.Helpers;
using ChatService.Models;
using ChatService.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatService.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly IMongoCollection<Conversation> _conversations = null;
        private readonly IMongoCollection<MessageDetail> _messages = null;
        private readonly IMongoCollection<User> _users = null;

        public ConversationRepository(IOptions<AppSettings> settings)
        {
            var dbContext = new MongoDbContext(settings);
            _conversations = dbContext.Conversations;
            _messages = dbContext.Messages;
            _users = dbContext.Users;
        }

        public IEnumerable<MessageDetail> GetMessageByConversationId(string id)
        {
            var messages = _messages.AsQueryable()
                .Where(x => x.ConversationId.Equals(id))
                .OrderByDescending(message => message.Time)
                .Select(x => x)
                .OrderBy(m => m.Time)
                .ToList();
            return messages;
        }

        public IEnumerable<Conversation> GetByUserId(string id)
        {
            var conversations = _conversations.AsQueryable()
                .Where(x => x.Receivers.Contains(id))
                .OrderByDescending(x => x.LastDate)
                .ToList();
            conversations.ForEach(c =>
            {
                c.Users = GetAllUserInConversation(c.Id).ToList();
            });
            return conversations;
        }

        public IEnumerable<Conversation> GetAll()
        {
            throw new NotImplementedException();
        }

        public Conversation GetById(string id)
        {
            throw new NotImplementedException();
        }

        public Conversation Add(Conversation param)
        {
            _conversations.InsertOne(param);
            return param;
        }

        public bool Delete(string id)
        {
            throw new NotImplementedException();
        }

        public Conversation Update(Conversation param)
        {
            _conversations.FindOneAndReplace(x => x.Id.Equals(param.Id), param);
            return param;
        }

        public IEnumerable<User> GetAllUserInConversation(string conversationId)
        {
            var users = _conversations.AsQueryable()
                .Where(x => x.Id.Equals(conversationId))
                .FirstOrDefault()
                .Receivers.Join(
                    _users.AsQueryable(),
                    receiver => receiver,
                    user => user.Id,
                    (receiver, user) => new User
                    {
                        Id = user.Id,
                        DisplayName = user.DisplayName,
                        ProfileImage = user.ProfileImage,
                        Connections = user.Connections
                    }
                 ).ToList();
            return users;
        }

        public Conversation FindPrivateConversationByReceiverId(string receiverId)
        {
            var conversation = _conversations.AsQueryable()
                .Where(c => c.Type.Equals("private") && c.Receivers.Contains(receiverId))
                .FirstOrDefault();
            return conversation;
        }

        public bool UpdateLastMessage(string conversationId, MessageDetail lastMessage)
        {
            var result = _conversations.UpdateOne(
                c => c.Id == conversationId,
                Builders<Conversation>.Update
                .Set("last_message", lastMessage.Content)
                .Set("last_date", lastMessage.Time));

            return result.IsAcknowledged;
        }

        public bool AddUserToGroupChat(string conversationId, string userId)
        {
            var result = _conversations.UpdateOne(
                c => c.Id == conversationId,
                Builders<Conversation>.Update.Push<string>(c => c.Receivers, userId));

            return result.IsAcknowledged;
        }
    }
}
