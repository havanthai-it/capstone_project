﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserServices.Models;

namespace UserServices.Reponsitories
{
    interface IRepository<T> where T : Model
    {
        IEnumerable<T> GetAll(string id);

        T GetById(string id);

        T Add(T document);

        T Update(T document);

        T Delete(T document);

    }
}
