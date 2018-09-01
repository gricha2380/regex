  ### Dev
  
run: `http-server -p 2380`  
view at: `http://localhost:2380/demo/`

# Regex Syllabus


  ### Introduction to Regex
  _AKA: learning the concept & reasons_
- What is it for?
  -  Finding desired patterns within strings of text
  -  Treats everything as sequence of characters
- Basic syntax
  -  Delimiter `/ ... /`
  -  flags `/ ... /igm`
     -  g: iterative search
     -  i: ignore case (case insensitive)
     -  m: multiline support

---
### Regex Lessons 
_AKA: learning the commands_
- Literal identifier
  -  `/literal/`matches `"literal"`
  -  Matching everything `.`
     -  `/.*/`
  -  Searching with Or `|`
     - `/everything|something/`  
  - Anchors
     - Match start of string: `/^pattern/`         
     -  Match end of string: `/pattern$/`  
- Carrot functions & importance of placement
  -  `/^literal/` will match `"literal lesson"`
  -  `/^literal/` will not match `"Something literal"`        
  -   `/^[literal]/` will match anything except `"literal"`
  -  `/literal$/` will match `"Something literal"`
- Escaping characters
  - Preceed character wth`\` e.g.: `\.`
- - Matching everything
  -  `/./` matches all characters including whitespaces
  -  escape `.` to match lteral period
- Quantifiers: repeating with +
	- `+` matches one or more of preceeding pattern
	- `l{1,3}` matches one to three repeated instances of letter l
	- `?` is used to make a pattern optional
		- `/pie?/` matches `pi`
- Shortcut classes vs long the way
  - `\d` vs `[0-9]`
  - `\w` vs `[a-zA-Z]`
  - `\D` vs `^[a-zA-Z]`  
 - Capture Groups 
	 - Use parentheses around multiple tokesn to group them together, similar to math
	 - `/Greg(ory)?/i` matches `greg` and `gregory`
	 - Probably not included in the game
		 - Backreferences `\1`Used to repeat the previous pattern
		 - Named groups
			 - `(?<mygroup>[abc])=\k<mygroup>` same as `([abc])=\1`

---
### Pratice Tasks & Challenges 
_AKA: Applying the knowledge_
- Match every version of `hello` except the last
  - q: `hello helllllllo helllo helo`
  - a: `/hel{2,6}o/`
- Match only the digits
  - q: `abc123xyz`
  - a: `/\d/` or `/[1-3]/` 
- Match everything except last string
	- q: `bird. mouse. house`
	- a: `/.*\./`
- Match every other word (requires array of strings with three or more words)
- Remove repeating characters
- Match valid .com web addresses
	- `^(http|https):\/\/+[\www\d]+\.[\w]+(\/[\w\d]+)?`
- Remove comma from number
- Match all zeros
- Match these email addresses (stacked enemies?)
- Match these phone numbers (stacked?)
- English & British spelling 
- Matching the hard way (with easy characters locked)

---
### Real World Use Cases
_AKA: What regex can do for you_
- Optional Characters (match alternate spellings)
  - `neighbo?ur`
  - `apologize || apologise`
  - `Jan(uary)?`
  - `{3}(.)?`
- Match email addresses
  - `/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/`
  - `/^.+@.+$/`
- Format phone numbers 
  - `/((\<1[\-\. ])?(\(|\<)\d\d\d[\)\.\-/ ] ?)?\<\d\d\d[\.\- ]\d\d\d\d\>/`
- SSN 
  - `/\<\d\d\d[\- ]\d\d[\- ]\d\d\d\d\>/`
- Remove comma from number
  - TBD
- Find HTML tag 
  - `<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)</\1>`
  - `<title>(.*)</title>`
- Trimming whitespace
  - `^[ \t]+|[ \t]+$`
  - `[ \t\r\n]`
- Matching valid date
  - `^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$`
- Credit card numbers 
  - `/\<((\d\d\d\d)[\- ]){3}\d\d\d\d\>/`
- Find or format currency [$ and 2 decimals]
  - `^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$`

