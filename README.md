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
<td>base64 to Text</td>
<td>

`SGVsbG8sIHRoaXMgaXMgYSBiYXNlNjQgZW5jb2RlZCBtZXNzYWdlLg==`

</td>
<td>

`Hello, this is a base64 encoded message.`

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

</table>

---
## bug
- [ ] json to golang `{"one":[[{"two":"second"}]]}` return `0 0 json:"0"`

---
## future dev
- [ ] copy/paste buttons right top text area
- [ ] syntax highlight