API services

Users:
1) Create user:
request: url: '/dev/user', method: POST, query_params: '', body: { username: '' }
2) Get user:
request: url: '/dev/user', method: GET, query_params: 'id', body: ''
3) Get users:
request: url: '/dev/users', method: GET, query_params: '', body: ''
4) Update user:
request: url: '/dev/user', method: PUT, query_params: 'id', body: { username: '' }
5) Delete user:
request: url: '/dev/user', method: DELETE, query_params: 'id', body: ''

Categories:
1) Create category:
request: url: '/dev/category', method: POST, query_params: '', body: { title: '' }
2) Get category:
request: url: '/dev/category', method: GET, query_params: 'id', body: ''
3) Get categories:
request: url: '/dev/categories', method: GET, query_params: '', body: ''
4) Update category:
request: url: '/dev/category', method: PUT, query_params: 'id', body: { title: '' }
5) Delete category:
request: url: '/dev/category', method: DELETE, query_params: 'id', body: ''

Purchases:
1) Create purchase:
request: url: '/dev/purchase', method: POST, query_params: '', body: { category: '', cost: '', date: '' }
2) Get purchase:
request: url: '/dev/purchase', method: GET, query_params: 'id', body: ''
3) Get purchases:
request: url: '/dev/purchases', method: GET, query_params: '', body: ''
- query_params: '' without query_params returns values related with current month; (default)
- query_params: '?date=2020' or '?date=2020-01' or '?date=2020-01-01';
- query_params: '?from=2020-01-01&to=2020-02-29';
4) Update purchase:
request: url: '/dev/purchase', method: PUT, query_params: 'id', body: { category: '', cost: '', date: '' }
5) Delete purchase:
request: url: '/dev/purchase', method: DELETE, query_params: 'id', body: ''