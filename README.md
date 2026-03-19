# ![Text Conventer](./favicon/favicon.ico) Text Conventer

<table>
<tr>
<th> Action </th>
<th> From </th>
<th> To </th>
</tr>
<tr>
<td>JSON to Golang struct</td>
<td>

```json
{
    "one": "two",
    "second": [
        "uno",
        "dos"
    ],
    "third": {
        "bir": 1,
        "eki": "second",
        "ush": true
    }
}
```

</td>
<td>

```go
type Root struct {
	One string `json:"one"`
	Second []string `json:"second"`
	Third Third `json:"third"`
}

type Third struct {
	Bir int `json:"bir"`
	Eki string `json:"eki"`
	Ush bool `json:"ush"`
}
```

</td>

<tr>
<td>JSON Beautify</td>
<td>

```json
  {
    "one":"two","second":[
"uno", "dos"
]
     }
```

</td>
<td>

```json
{
    "one": "two",
    "second": [
        "uno",
        "dos"
    ]
}
```

</td>
</tr>
<tr>
<td>JSON Minify</td>
<td>

```json
{
    "one": "two",
    "second": [
        "uno",
        "dos"
    ]
}
```

</td>
<td>

```json
{"one":"two","second":["uno","dos"]}
```

</td>
</tr>

<tr>
<td>Base64 to Text</td>
<td>

`SGVsbG8sIHRoaXMgaXMgYSBiYXNlNjQgZW5jb2RlZCBtZXNzYWdlLg==`

</td>
<td>

`Hello, this is a base64 encoded message.`

</td>
</tr>

<tr>
<td>Text to Base64</td>
<td>

`Hello, Здравствуйте, 您好`

</td>
<td>

`SGVsbG8sINCX0LTRgNCw0LLRgdGC0LLRg9C50YLQtSwg5oKo5aW9`

</td>
</tr>

<tr>
<td>ProtoBuff to TypeScript</td>
<td>

```protobuff
syntax = "proto3";

package compact.complex;

enum Status {
    ACTIVE = 0;
    INACTIVE = 1;
    SUSPENDED = 2;
}

message Person {
    string name = 1;
    int32 age = 2;
    Status status = 3;
    repeated string hobbies = 4;
    map<string, string> attributes = 5;
}

message Organization {
    string name = 1;
    Person leader = 2;
    repeated Person members = 3;
    map<string, string> departments = 4;
    bool isPublic = 5;
}
```

</td>
<td>

```typescript
enum Status {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}

interface Person {
  name: string;
  age: number;
  status: Status;
  hobbies: string[];
  attributes: Map<string, string>;
}

interface Organization {
  name: string;
  leader: Person;
  members: Person[];
  departments: Map<string, string>;
  isPublic: boolean;
}
```

</td>
</tr>

<tr>
<td>HTML to Golang Struct</td>
<td>

```html
<div class="product" data-id="1001">
  <h2>Laptop Pro 14</h2>
  <span class="price">450000</span>
  <div class="specs">
    <p>CPU: Intel i5</p>
    <p>RAM: 16GB</p>
    <p>SSD: 512GB</p>
  </div>
  <a href="/buy/1001">Buy now</a>
</div>
```

</td>
<td>

```go
type Document struct {
	Div Div `html:"div"`
}

type Div struct {
	Class string `html:"class,attr"`
	DataId string `html:"data-id,attr"`
	H2 H2 `html:"h2"`
	Span Span `html:"span"`
	Div Div `html:"div"`
	A A `html:"a"`
}

type H2 struct {
	Text string `html:",innerhtml"`
}

type Span struct {
	Text string `html:",innerhtml"`
	Class string `html:"class,attr"`
}

type A struct {
	Text string `html:",innerhtml"`
	Href string `html:"href,attr"`
}


```

</td>
</tr>

<tr>
<td>Dyntrace JSON to CSV</td>
<td>

```json
{
  "extrapolationLevel": 1,
  "columnNames": [
    "useraction.name",
    "useraction.application",
    "useraction.startTime",
    "useraction.endTime",
    "useraction.duration",
    "useraction.actionType",
    "useraction.stringProperties",
    "usersession.userId",
    "usersession.userSessionId"
  ],
  "values": [
    [
      "login_start",
      "Mobile App",
      1773901200123,
      1773901201456,
      1333,
      "CUSTOM",
      {
        "screen": "auth",
        "step": "start"
      },
      "Q003017277",
      "8834521093874512345"
    ],
    [
      "login_submit",
      "Mobile App",
      1773901203000,
      1773901203890,
      890,
      "CUSTOM",
      {
        "screen": "auth",
        "result": "success"
      },
      "Q003017277",
      "8834521093874512345"
    ],
    [
      "card_issue",
      "Mobile App",
      1773901210000,
      1773901212100,
      2100,
      "CUSTOM",
      {
        "product": "premium",
        "channel": "mobile"
      },
      "Q003017277",
      "8834521093874512345"
    ]
  ]
}
```

</td>
<td>

```csv
useraction.name,useraction.application,useraction.startTime,useraction.endTime,useraction.duration,useraction.actionType,useraction.stringProperties,usersession.userId,usersession.userSessionId
login_start,Mobile App,1773901200123,1773901201456,1333,CUSTOM,"{""screen"":""auth"",""step"":""start""}",Q003017277,8834521093874512345
login_submit,Mobile App,1773901203000,1773901203890,890,CUSTOM,"{""screen"":""auth"",""result"":""success""}",Q003017277,8834521093874512345
card_issue,Mobile App,1773901210000,1773901212100,2100,CUSTOM,"{""product"":""premium"",""channel"":""mobile""}",Q003017277,8834521093874512345

```

</td>
</tr>

<tr>
<td>Encode URL</td>
<td>

`SELECT * FROM useraction WHERE useraction.application = 'Mobile App' AND usersession.userId='Q003017277'`

</td>
<td>

`SELECT%20*%20FROM%20useraction%20WHERE%20useraction.application%20%3D%20'Mobile%20App'%20AND%20usersession.userId%3D'Q003017277'`

</td>
</tr>

<tr>
<td>Decode URL</td>
<td>

`SELECT%20*%20FROM%20useraction%20WHERE%20useraction.application%20%3D%20'Mobile%20App'%20AND%20usersession.userId%3D'Q003017277'`

</td>
<td>

`SELECT * FROM useraction WHERE useraction.application = 'Mobile App' AND usersession.userId='Q003017277'`

</td>
</tr>

<tr>
<td>String to Stringified</td>
<td>

```
Order created successfully
User: Q003017277
Product: Virtual Card
Price: 450000
Status: "approved"
Details: line1 -> start, line2 -> finish
```

</td>
<td>

`"Order created successfully\nUser: Q003017277\nProduct: Virtual Card\nPrice: 450000\nStatus: \"approved\"\nDetails: line1 -> start, line2 -> finish"`

</td>
</tr>

<tr>
<td>Stringified to String</td>
<td>

`"Order created successfully\nUser: Q003017277\nProduct: Virtual Card\nPrice: 450000\nStatus: \"approved\"\nDetails: line1 -> start, line2 -> finish"`

</td>
<td>

```
Order created successfully
User: Q003017277
Product: Virtual Card
Price: 450000
Status: "approved"
Details: line1 -> start, line2 -> finish
```

</td>
</tr>

<tr>
<td>Zabbix API JSON to CSV</td>
<td>

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "triggerid": "31245",
      "description": "High CPU usage on web-server-01",
      "expression": "{web-server-01:system.cpu.util[,idle].last()}<20",
      "priority": "4",
      "status": "0",
      "value": "1",
      "lastchange": "1773901100",
      "hosts": [
        {
          "hostid": "10601",
          "host": "web-server-01",
          "name": "Web Server 01"
        }
      ]
    },
    {
      "triggerid": "31246",
      "description": "Low disk space on db-server-01",
      "expression": "{db-server-01:vfs.fs.size[/,pfree].last()}<15",
      "priority": "3",
      "status": "0",
      "value": "0",
      "lastchange": "1773900000",
      "hosts": [
        {
          "hostid": "10602",
          "host": "db-server-01",
          "name": "DB Server 01"
        }
      ]
    }
  ],
  "id": 1
}
```

</td>
<td>

```csv
"triggerid","description","expression","priority","status","value","lastchange","hosts.hostid","hosts.host","hosts.name"
"31245","High CPU usage on web-server-01","{web-server-01:system.cpu.util[,idle].last()}<20","4","0","1","1773901100","10601","web-server-01","Web Server 01"
"31246","Low disk space on db-server-01","{db-server-01:vfs.fs.size[/,pfree].last()}<15","3","0","0","1773900000","10602","db-server-01","DB Server 01"
```

</td>
</tr>

</table>

---
## bug
- [ ] json to golang `{"one":[[{"two":"second"}]]}` return `0 0 json:"0"`

---
## future dev
- [ ] copy/paste buttons right top text area
- [ ] syntax highlight