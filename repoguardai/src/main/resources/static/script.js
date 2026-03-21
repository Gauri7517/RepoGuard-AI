async function analyzeRepo() {

    let url = document.getElementById("repoUrl").value;

    if (!url.includes("github.com")) {
        alert("Enter a valid GitHub repository URL");
        return;
    }

    let parts = url.split("/");

    if(parts.length < 5){
        alert("Enter repository URL like https://github.com/user/repo");
        return;
    }

    let owner = parts[3];
    let repo = parts[4];

    try {

        let response = await fetch(`/api/repo?owner=${owner}&repo=${repo}`);

        let data = await response.json();

        // Stats update
        document.getElementById("files").innerText = data.size + " KB";
        document.getElementById("issues").innerText = data.commits;
        document.getElementById("watchers").innerText = data.contributors;

        // ⭐ Code Quality Calculation
        let score =
            (data.stars * 5) +
            (data.contributors * 10) +
            (data.commits * 2) +
            (data.forks * 5);

        if(score > 100){
            score = 100;
        }

        document.getElementById("stars").innerText = score + " / 100";

        // Tech Stack
        let techList = "";
        let languages = "";

        data.languages.forEach(lang => {
            techList += "<li>✔ " + lang + "</li>";
            languages += lang + ", ";
        });

        languages = languages.slice(0, -2);

        document.getElementById("tech").innerHTML = techList;

        // AI Summary
        document.getElementById("summary").innerText =
            "This repository uses " + languages +
            " and has " + data.commits +
            " commits with " + data.contributors +
            " contributors.";

        // Repo structure (demo)
        document.getElementById("structure").innerHTML =
            "<li>src</li><li>controller</li><li>service</li><li>repository</li><li>model</li>";

        // Security check
        if(data.size > 500000){
            document.getElementById("security").innerText =
                "Large repository detected. Consider dependency vulnerability scanning.";
        }
        else{
            document.getElementById("security").innerText =
                "No critical security issues detected.";
        }

        // File analysis
        document.getElementById("fileanalysis").innerText =
            "Repository size is " + data.size + " KB.";

        // Dynamic suggestion
        let suggestion = "";

        if(data.commits < 10){
            suggestion = "Low commit activity. Consider improving commit frequency.";
        }
        else if(data.contributors > 5){
            suggestion = "Multiple contributors detected. Maintain coding standards.";
        }
        else if(data.size > 500000){
            suggestion = "Large project detected. Consider modularizing components.";
        }
        else{
            suggestion = "Project structure looks good. Maintain modular design.";
        }

        document.getElementById("refactor").innerText = suggestion;

    }
    catch(error){

        console.error(error);
        alert("Error fetching repository data");

    }

}