﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using PostService.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PostService.Utils
{
    public class ReadAppSettings
    {
        public static IOptions<AppSettings> ReadDbSettings()
        {
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);

            var appSettings = configurationBuilder.Build().GetSection("AppSettings");

            var settings = Options.Create(new AppSettings()
            {
                ConnectionString = appSettings.GetSection("ConnectionString").Value,
                DatabaseName = appSettings.GetSection("DatabaseName").Value
            });

            return settings;
        }

        public static IOptions<PubsubSettings> ReadPubsubSettings()
        {
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);

            var pubsubSettings = configurationBuilder.Build().GetSection("PubsubSettings");

            var settings = Options.Create(new PubsubSettings()
            {
                ProjectId = pubsubSettings.GetSection("ProjectId").Value,
                TopicId = pubsubSettings.GetSection("TopicId").Value,
                SubscriptionId = pubsubSettings.GetSection("SubscriptionId").Value
            });

            return settings;
        }
    }
}
