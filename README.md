#Fandom
<h2>Working</h2>
Bootstrap has been added and working
The login page will correctly authenticate users using Passport on the backend. The profile page will correctly show the logged in user.
The logout button will send a logout request to the server to log the user out.

<h2>Installation</h2>
Use the following commands in your vagrant development environment to get this up and running
```bash
git clone https://github.com/uiuc-web-programming/mp3_client_starter.git
cd mp3_client_starter
npm install
bower install
grunt compass:dev
grunt compass:bootstrap
grunt uglify
grunt
```
<h2>Files That Can Be Modified</h2>
<ul>
    <li>public/bootstrap/assets/stylesheets/*</li>
    <li>sass/*</li>
</ul>