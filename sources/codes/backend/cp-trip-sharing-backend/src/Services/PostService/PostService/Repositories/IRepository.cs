﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PostService.Models;

namespace PostService.Repositories
{
    public interface IRepository<T> where T : Model
    {
        IEnumerable<T> GetAll();

        T GetById(string id);

        T Add(T param);
    }
}
