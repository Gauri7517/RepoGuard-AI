package com.repoguard.repoguardai.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class RepoController {

	private final String TOKEN = System.getenv("GITHUB_TOKEN");

    public Map callGitHub(String url){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization","Bearer " + TOKEN);
        headers.set("Accept","application/vnd.github.v3+json");

        HttpEntity entity = new HttpEntity(headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return response.getBody();
    }

    public List callGitHubList(String url){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization","Bearer " + TOKEN);
        headers.set("Accept","application/vnd.github.v3+json");

        HttpEntity entity = new HttpEntity(headers);

        ResponseEntity<List> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

        return response.getBody();
    }

    @GetMapping("/repo")
    public Map<String,Object> getRepo(@RequestParam String owner,
                                      @RequestParam String repo){

        Map repoData = callGitHub(
                "https://api.github.com/repos/"+owner+"/"+repo);

        List commits = callGitHubList(
                "https://api.github.com/repos/"+owner+"/"+repo+"/commits");

        List contributors = callGitHubList(
                "https://api.github.com/repos/"+owner+"/"+repo+"/contributors");

        Map languages = callGitHub(
                "https://api.github.com/repos/"+owner+"/"+repo+"/languages");

        Map<String,Object> result = new HashMap<>();

        result.put("size", repoData.get("size"));
        result.put("stars", repoData.get("stargazers_count"));
        result.put("forks", repoData.get("forks_count"));
        result.put("language", repoData.get("language"));

        result.put("commits", commits.size());
        result.put("contributors", contributors.size());

        result.put("languages", languages.keySet());

        return result;
    }
}