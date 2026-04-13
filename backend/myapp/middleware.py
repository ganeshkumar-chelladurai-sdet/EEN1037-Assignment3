"""
Logging middleware for API requests and responses.

Logs the HTTP method, path, headers, and JSON payloads for every API request.
Useful for debugging and understanding the HTTP request/response cycle
(e.g. JWT tokens, Content-Type negotiation, request/response bodies).

Enable by adding 'myapp.middleware.RequestLoggingMiddleware' to MIDDLEWARE
in settings.py, and setting the 'myapp.middleware' logger to DEBUG.
"""

import json
import logging

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    allowed_urls = ['/api/']
    denied_urls = ['/api/schema/']

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not any(request.path.startswith(p) for p in self.allowed_urls):
            return self.get_response(request)

        log_body = not any(request.path.startswith(p) for p in self.denied_urls)

        # Log request
        body = ''
        if log_body and request.content_type == 'application/json' and request.body:
            try:
                body = '\n  Request body (JSON): ' + json.dumps(json.loads(request.body), indent=2)
            except (json.JSONDecodeError, ValueError):
                pass
        logger.debug('%s %s\n  Request headers: %s%s',
                     request.method, request.get_full_path(), dict(request.headers), body)

        response = self.get_response(request)

        # Log response
        body = ''
        if log_body and response.get('Content-Type', '').startswith('application/json'):
            try:
                body = '\n  Response body (JSON): ' + json.dumps(json.loads(response.content), indent=2)
            except (json.JSONDecodeError, ValueError):
                pass
        logger.debug('%s %s %s\n  Response headers: %s%s',
                     request.method, request.get_full_path(), response.status_code, dict(response.headers), body)

        return response
