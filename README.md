# MUMU Season2 API Document


## Manual Installation

1.install mySQL
2. run command for db setting
```bash
CREATE DATABASE dbname;
CREATE TABLE IF NOT EXISTS `user` (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255),
  published BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

3.run command for clone
```bash
git clone --depth 1 https://github.com/mumuSeaosn2/Backend.git
cd Back
```

4.Install the dependencies:
```bash
yarn install
```

5.chanege the db.config and delete the word .example in name


6.run the express server
```bash
node server.js
```

7.chekdout http://localhost:3000/api/docs/

## License

[MIT](LICENSE)
