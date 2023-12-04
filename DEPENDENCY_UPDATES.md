This is a reference on how to perform a safe dependencies update. It consists of step-by-step instruction and a list of known issues. Do not hesitate to contribute when facing outdated information or encountering a new issue.

## 🦾 Engine support

Version of npm and the node on which the project runs

```json
"node": "^18.0.0",
"npm": "^8.6.x"
```

## ♻️ Recommended way to update dependencies

This routine assumes you’ll be using `npm` as the main package manager.

- `npm update` - this command will update all the packages listed to the latest version (specified by the tag config), respecting the [semver](https://semver.org/) constraints of both your package and its dependencies (if they also require the same package). It will also install missing packages.

💡 Note that by default `npm update` will not update the [semver](https://semver.org/) values of direct dependencies in your project `package.json`, if you want to also update values in `package.json` you can run: `npm update --save` (or add the `save=true` option to a [configuration file](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc) to make that the default behavior).

1. Open up the project, fetch latest changes, branch out

2. Run `npm update --save` to update all the versions in your package.json

The most common/best practice is to never allow automatic updates to versions that have potentially critical changes this applies to `major` versions so in this case you can rest assured that you will not get critical changes during the upgrade, but if you want to upgrade the `major` version you will need to do it manually (more about this in step 5) - this will allow you to further check and make sure everything works fine

⚠️ **Please, make yourself familiar with conventional [semver constraints](https://docs.npmjs.com/cli/v8/commands/npm-update#example)**

3. Run `npm install` to update the deps

4. Run the project, check if everything is okay

5. Run `npm outdated` to check for major versions that we can update

<details>
  <summary>Example output</summary>
    <img width="795" alt="" src="https://user-images.githubusercontent.com/17677196/172698954-49d348ec-18a6-4851-a97c-b5b3b6da1c7b.png">
</details>

Use the `npm install <packageName>@latest` command to update the dependencies, in this case we recommend updating each dependency in stages, going back to step 3 and 4 to check that the project is working

6. If you are done, commit the changes and make a PR

Send your PR to the [#review-dev](https://pixelpointworkspace.slack.com/archives/C02GWMHD5LK) channel for review, and once it is approved to merge with the main branch, update the project data in the [Deps update](https://www.notion.so/Event-block-on-https-www-vshn-ch-en-show-the-next-3-upcoming-events-from-https-www-vshn-ch-en--5090215f3b6e4b1abf0568f2c2ca27bb) table

## Alternative dependency update routine

In case `npm update` malfunctioning or need to update deps to the latest versions, ignored specified versions, you may want to follow an alternative approach below

<details>
<summary>Alternative approach</summary>

- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) is a handy little library that for historic reasons came into spotlight as a properly working alternative to [everbugging](https://github.com/npm/cli/issues/708) native `npm outdated && npm update`
- [npx](https://docs.npmjs.com/cli/v8/commands/npx) is a part of functionality of `npm` that allows you use npm packages remote, without local installation

1. Open up the project, fetch latest changes, branch out
2. Run `npx npm-check-updates` to get the list of packages that are out of date

Example output
<img width="958" alt="" src="https://user-images.githubusercontent.com/17677196/172212672-9d4c68e3-b488-4b8f-a979-c84c7913a21d.png">

As you may have noticed, `ncu` is colorizing the possible updates into 3 colors: green, cyan and red.

**🟢 Green updates**

All the libraries that are in green can be updated safely without really looking at the changelogs (it only concerns patches updates)... So far, we haven't faced any issue when we were updating green dependencies. So usually, just select all of them and update them together.

**🔵 Cyan updates**

Cyan updates are related to minor updates. So normally, you should be able to update them without any problem but we'd suggest you to do it one by one and by running tests after each update. It'll take time but it'll be safer.

**🔴 Red updates**

Red updates are for major updates. So somehow it means that the version you've specified in the package.json is really permissive. For sure here, you have to update them one by one and have a real look at the changelogs !

3. Run `npx npm-check-updates -u` to update all the versions in your package.json

In this case you'd want to check out changes in `package.json` and revert particular lines which contain major version update.

3. Or make use of `npx npm-check-updates <package1> <package2> <packageN>` command to perform batch categories update

In this case you'd want to specify all the libraries with green updates first

4. Run `npm install` to update the deps

5. Run the project, check if everything is okay

6. If you are done, commit the changes and make a PR, if not, repeat steps 2-5 but with cyan and red updates

</details>

## 🐛 Known issues

Add information if you're having trouble updating any dependencies, this could be very helpful for future updates

<details>
  <summary>Example</summary>

### packageName

- **Issue found on:** D Month, YYYY
- **Problematic version:** x.x.x
- **Last stable version:** x.x.x

Space for a free-form description of the problem

</details>

### remark-gfm

[Breaks with latest version of remark-gfm](https://github.com/hashicorp/next-mdx-remote/issues/403)

- **Issue found on:** 01 December, 2023
- **Problematic version:** 4.0.0
- **Last stable version:** 3.0.1

### next

Get the error when update Next.js to v14, can't use serialize in client components.
Error message: `export 'serialize' (reexported as 'serialize') was not found`.
[Related issue](https://github.com/hashicorp/next-mdx-remote/issues/416)

- **Issue found on:** 01 December, 2023
- **Problematic version:** >14.x.x
- **Last stable version:** 13.5.6
