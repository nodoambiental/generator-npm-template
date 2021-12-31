"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the NA ${chalk.red("NPM library template")} generator!`)
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
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath("dummyfile.txt"),
      this.destinationPath("dummyfile.txt")
    );
  }

  install() {
    this.installDependencies();
  }
};
