## Test something about the API

### Settings

```yaml
method: POST

headers:
  content-type: application/json

authorization:
  basic:
    username: {{ USERNAME }}
    password: {{ PASSWORD }}

body: raw
```


### Body [optional]

```json
{
  "foo": "bar",
  "more": "{{SOME_VAR}}",
  "bar": [1, 2, 3, 4],
  "payload": {
    "message": {
      "name": "John",
      "phone": "123456789"
    }
  }
}
```


### Before [optional]

```javascript
import _ from 'lodash'
import moment from 'moment'
import request from 'request'

export default async req => {
  const json = JSON.parse(req.body)

  _.set(json, 'some.deeply.nested.value', 200)
  _.set(json, 'first.datetime', moment().format())

  _.set(json, await someApiCall())

  _.set(req.vars, 'SOME_VAR', moment().format())

  const req.body = JSON.stringify(json)
}
```


### After [optional]

```javascript
import test from 'ava'

export default res => {

  test('something is correct', t => {
    t.ok(_.get(res.body, 'some.value', false))
  })

  test('something else is correct', t => {
    t.ok(_.get(res.body, 'some.value', false))
  })
}
```
