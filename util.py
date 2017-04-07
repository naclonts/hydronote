

def show_urls(urllist, depth=0):
    """Takes site urls.urlpatterns and lists."""
    for entry in urllist:
        print("   " * depth, entry.regex.pattern)
        if hasattr(entry, 'url_patterns'):
            show_urls(entry.url_patterns, depth + 1)


