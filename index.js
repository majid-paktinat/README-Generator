const fs = require('fs');
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");
const pressAnyKey = require('press-any-key');
const writeFileAsync = util.promisify(fs.writeFile);
let pageContent="";

init();

function init(){
	console.clear();
	inquirer
		.prompt([
			{
				message: "Enter your GitHub username: ",
				name: "username",
				validate: validateFunc
			},
			{
			  	type: "input",
			  	message: "What is your project title? (required): ",
				name: "projecttitle",
				validate: validateFunc
			},
			{
			  type: "input",
			  message: "What is the project description? (required): ",
			  name: "projectdescription",
			  validate: validateFunc
			},
			{
				type: "checkbox",
				message: "Table of Contents (Optional): ",
				name: "tableofcontents",
				choices: [
					"[Installation](#installation)", 
					"[Usage](#usage)", 
					"[Credits](#credits)", 
					"[License](#license)"
				  ]
			},
			{
			  type: "input",
			  message: "What are the steps required to install your project? ",
			  name: "installation"
			},
			{
				type: "input",
				message: "Provide instructions and examples for use. ",
				name: "usage"
			},
			{
				type: "input",
				message: "List your collaborators (comma-separated) : ",
				name: "credit"
			},
			{
				type: "list",
				message: "license: ",
				name: "license",
				choices: [
					"GNU",
					"BSD",
					"MIT"
				]
			}
		  ])
		.then(function( answers ) { // if taki bashe : then(function({ username }) {
			generatePageContent(answers);

		});
}

function pressAnyKeyFunc(){
	pressAnyKey("Press any key to resolve, or CTRL+C to reject", {
		ctrlC: "reject"
		})
		.then(() => {
			init();
		})
		.catch(() => {
			console.log('You pressed CTRL+C')
	  })
}

function validateFunc(input){
	if (input.trim().length==0) { //if (typeof input !== 'number')
		console.clear();console.log('Please enter a value! \n');
        return false;
	}
	else {
		return true;
	}
}
	
function callbackFunc(res) {
	pageContent = generatePageContent(res);

	// fs.writeFile("README.md", pageContent, (err, data) => {
	// 	// if there's an error, log it and return
	// 	if (err) {
	// 		//console.error(err)
	// 		console.log(err);
	// 		//return
	// 	}
	// });
	

	writeFileAsync("README.md", pageContent)
	.then(function() {
		console.log("\n Successfully wrote to README.md");
	  })
	.catch(function(err) {
		console.log(err);
	  });

}

function catchError(err){
	if (err.response.status==404){
		console.log("\n *** GitHub username provided not exist! *** \n")
		pressAnyKeyFunc();
	}
}




  
async function generatePageContent(answers){

	const queryUrl = `https://api.github.com/users/${answers.username}`;
	//axios.get(queryUrl).then(callbackFunc).catch(catchError);
	const data = await axios.get(queryUrl); // pas chera onike khodesh nevesht return nadasht ?!

	
	pageContent = `## Image is :  \n![readme](${data.data.avatar_url})` + "\n\n" +
					`## Email is : \n${(data.email==null)?"":data.email} \n\n`+
					`## Project Title : \n${answers.projecttitle} \n\n` +
					`## Project Description : \n${answers.projectdescription} \n\n` +
					`## Table of Contents (Optional): \n${answers.tableofcontents} \n\n` +
					`## [Installation](#installation) \n${answers.installation} \n\n` +
					`## [Usage](#usage) \n${answers.usage} \n\n` +
					`## [Credits](#credits) \n${answers.credit} \n\n` +
					`## [License](#license) \n${answers.license}`;

	//return  pageContent;
	writeFileAsync("Markdown/README.md", pageContent)
	.then(function() {
		console.log("\n Successfully wrote to README.md");
	})
	.catch(function(err) {
		console.log(err);
	});

}


  

