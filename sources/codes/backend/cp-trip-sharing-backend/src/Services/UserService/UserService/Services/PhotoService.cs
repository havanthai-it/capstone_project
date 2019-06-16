﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserServices.Reponsitories;
using Microsoft.Extensions.Options;
using UserServices.Helpers;
using UserServices.Models;

namespace UserServices.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly PhotoRepository _photoRepository = null;

        public PhotoService(PhotoRepository photoRepository)
        {
            _photoRepository = photoRepository;
        }

        public PhotoService(IOptions<AppSettings> settings)
        {
            _photoRepository = new PhotoRepository(settings);
        }

        public Photo AddPhoto(Photo photo)
        {
            return _photoRepository.Add(photo);
        }

        public IEnumerable<Photo> GetAllPhoto(string userId)
        {
            return _photoRepository.GetAll(userId);
        }
    }
}