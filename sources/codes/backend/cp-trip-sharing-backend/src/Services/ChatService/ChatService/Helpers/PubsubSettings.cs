﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatService.Helpers
{
    public class PubsubSettings
    {
        public string ProjectId { get; set; }
        public string TopicId { get; set; }
        public string SubscriptionId { get; set; }
    }
}
