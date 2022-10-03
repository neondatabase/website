---
title: Branching
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

A branch is a copy of your Neon Project data created from the current state or from a past state that is still available.

When you create a branch, all of the data in the parent Project is available in the branched Project, but changes to the branch afterward are independent of the parent Project and vice versa.

Branch creation does not increase load on the parent Project. You can create a branch at any time without affecting the performance of your production system, and no downtime is required.

_**Note**: Neon branching capabilities are not yet publicly available. If you would like to try this feature, contact Neon at [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

Branching has many possible uses, some of which are outlined below:

- **Development**
     - Create a branch for each Developer
	
- **Testing** 
    -	Run tests on a current branch of production or staging data
    -	Test potentially destructive queries before deploying them to production
    -	Test schema changes
    -	Run tests on real data &mdash; branching eliminates the need to hydrate a test database
    -	Run tests in parallel on separate branches, each with its own dedicated compute

- **Staging**
    - Create a staging database by branching your production data
    - Create a branch for every pull request in your CI/CD pipeline
			
- **Backup** 
    -	Quickly and easily create backup branches
    -	Instantly restore a previous state by branching from a previously created backup branch
    -	Name backup branches according to the time they were created for convenient point-in-time restore (PITR)
	
- **Replication**	
    - Use branching to quickly and easily clone replicas

- **Historical Analysis**
    -	Run time-travel queries against a historical state
    -	Create a branch from a past point in time to reproduce an issue
	
- **Simulation**	
    - Run "what if" scenarios on a branch of your production data
    - Perform each simulation on its own branch
	
- **Analytics**
    - Run costly queries on a branch of your production data, each with its own resources
	
- **Machine Learning**
    -	Create a branch for ML model training
    -	Name or tag a branch for a specific point in time for ML model training repeatability