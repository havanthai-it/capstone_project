﻿using System.Collections.Generic;
using UserServices.Models;

namespace UserServices.Services.Interfaces
{
    public interface IBookmarkService
    {
        Bookmark AddBookmark(Bookmark bookmark);
        Bookmark DeleteBookmark(Bookmark bookmark);
        IEnumerable<Bookmark> GetUserBookmarks(string userId);
        IEnumerable<string> GetUserBookmarkId(string id);
    }
}