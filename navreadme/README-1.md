# orleans-parish-online-personal-property-reporting (OPOPPR)

This repository contains the source code and documentation for the Orleans Parish Online Property Reporting (OPOPPR) application. The repository is broken into several directories which contain the source and and scripts needed to build the OPOPPR database, application, and reports.

|Directory|Description|Readme|
|---|---|---|
|Design|System Design documentation|[View](Design/README.md)|
|Database|Database model developed in MySQL Workbench and SQL scripts that are used to build the database.|[View](Database/README.md)|
|opoppr|The OPOPPR Java source code.|[View](opoppr/README.md)|
|jasper|Jasper report definition that was used to build the OPOPPR reports.|[View](jasper/README.md)|
|AdminScripts|???|[View](AdminScripts/README.md)|
|2021 Backup|Copy of the opoppr.war file and various scripts that we deployed before 2021 when we migrated the application to AWS.|

Refer to [3.2 Technology Stack](Design/README.md#32-technology-stack) in the System Design Document (SDD) for a list of tools that you will need to install in order to develop OPOPPR.
[How-To](HOW-TO/HOW-TO.md) contains instructions for executing common OPOPPR tasks.
