"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const Child = require("child_process");

chalk.Level = 3;
const message = chalk.hex("#8DC73E");
const message2 = chalk.hex("#7977B8");
const message3 = chalk.hex("#3FBC9D");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the NA ${chalk.green("NPM library template")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Package (and therefore repo) name",
        default: "my-library"
      },
      {
        type: "input",
        name: "description",
        message: "Package description",
        default: "I am a package"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.name = this.props.name.replace(/\s/g, "-");
    });
  }

  writing() {
    // Copy files
    console.log(message("Copying files..."));
    this.fs.copy(
      this.templatePath("npm/"),
      this.destinationPath(`${this.props.name}/`)
    );
    console.log(message("...Done."));
  }

  install() {
    // Get user data from git
    console.log(message("Retrieving user data..."));
    const gitUser = Child.execSync("git config --get user.name")
      .toString()
      .trim();
    const gitEmail = Child.execSync("git config --get user.email")
      .toString()
      .trim();
    console.log(message("...Done."));

    // Replace placeholders
    console.log(message("Replacing placeholders..."));
    Child.execSync(
      `sed -i.bak 's/@@AUTHOR_NAME@@/${gitUser}/' ./${this.props.name}/package.json`
    );
    Child.execSync(
      `sed -i.bak 's/@@AUTHOR_EMAIL@@/${gitEmail}/' ./${this.props.name}/package.json`
    );
    Child.execSync(
      `sed -i.bak 's/@@NAME@@/${this.props.name}/' ./${this.props.name}/package.json`
    );
    Child.execSync(
      `sed -i.bak 's/@@DESCRIPTION@@/${this.props.description}/' ./${this.props.name}/package.json`
    );
    console.log(message("...Done."));

    // Create repo
    console.log(message2("Creating new public repository..."));
    Child.execSync(`gh repo create nodoambiental/${this.props.name} --public`);
    console.log(message2("...Done."));

    // Init repo
    console.log(message2("Configuring repository..."));
    Child.execSync(`git init ${this.props.name}`);

    // Configure repo
    Child.execSync(
      `echo '[remote "origin"]' >> ./${this.props.name}/.git/config`
    );
    Child.execSync(
      `echo '\turl = git@github.com:nodoambiental/${this.props.name}.git' >> ./${this.props.name}/.git/config`
    );
    Child.execSync(
      `echo '\tfetch = +refs/heads/*:refs/remotes/origin/*' >> ./${this.props.name}/.git/config`
    );
    Child.execSync(
      `echo '[branch "master"]' >> ./${this.props.name}/.git/config`
    );
    Child.execSync(
      `echo '\tremote = origin' >> ./${this.props.name}/.git/config`
    );
    Child.execSync(
      `echo '\tmerge = refs / heads / master' >> ./${this.props.name}/.git/config`
    );
    console.log(message2("...Done."));

    // Install dependencies
    console.log(message3("Installing dependencies..."));
    Child.execSync(`npm install -C ./${this.props.name}`);
    console.log(message3("...Done."));

    // Push the template
    console.log(message3("Pushing repository..."));
    Child.execSync(`git -C ./${this.props.name}/ add -A`);
    Child.execSync(
      `git -C ./${this.props.name}/ commit -m 'build(generator): build template'`
    );
    Child.execSync(`git -C ./${this.props.name}/ push origin master`);
    console.log(message3("...Done."));

    console.log(message("All Done!"));
  }
};
