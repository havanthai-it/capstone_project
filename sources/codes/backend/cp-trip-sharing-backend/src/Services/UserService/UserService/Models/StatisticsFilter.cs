﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserServices.Models
{
    public class StatisticsFilter:Model
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}