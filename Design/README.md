
# **System Design Document (SDD)**  
## **Orleans Parish Online Personal Property Reporting System**  
**Version:** 2025.1
**Date:** Novembver 29, 2024

---

## **1. Introduction**  
### **1.1 Purpose**  
This document outlines the system architecture, components, and design considerations for the Orleans Parish Online Personal Property Reporting System. The goal is to provide a robust platform for individuals and businesses to report personal property online in order to calculate taxes on said property in compliance with local laws.

### **1.2 Scope**  
The system will allow users to:  
- Submit personal property declarations online.  
- Integrate seamlessly with the parish tax collection system for calculations and payments.  

### **1.3 Intended Audience**  
- Parish Tax Office Staff  
- System Developers and Administrators  
- End Users (Residents and Businesses)  

---

## **2. System Overview**  
### **2.1 System Objectives**  
- Simplify personal property tax reporting for residents.  
- Reduce administrative overhead for tax office personnel.  
- Ensure secure and accurate data collection.  

### **2.2 User Types**
OPOPPR supports the following types of users.

|User Type|Description|
|-|-|
|Administrators|Admin users can reset the database, import/export data into the database, and run reports.|
|Tax Preparers|Tax prepares can enter data into forms, review their forms, and submit the forms for processing by Administrators.|

### **2.2 Assumptions and Constraints**  
- Users must have internet access to report online.  
- The system will comply with state and federal security standards.  
- Development will be completed by Feburary 15, 2025.

### **2.3 System Context Diagram**  
![OPOPPR Context Diagram](<diagrams/OPOPPR - Context.jpg>)
---

## **3. System Architecture**  
### **3.1 High-Level Architecture**  
The system follows a **three-tier architecture**:  
1. **Presentation Layer**: A responsive web interface accessible on desktop devices.  
2. **Application Layer**: Implements business logic that manages the reading and writing of user input to the **Data Layer**.
3. **Data Layer**: Handles storage and retrieval of user data.

![OPOPPR Tiers](<diagrams/OPOPPR - Tiers.jpg>)

### **3.2 Technology Stack**  
- **Programming Languages**: Java (openjdk version 17) ([Download](https://openjdk.org/)), JavaScript, and SQL
- **Web Server**: Apache Tomcat 9 ([Download](https://tomcat.apache.org/))
- **IDE**: Visual Studio Code (VSCode) ([Download](https://code.visualstudio.com/))
- **Frontend Frameworks**: JavaServer Faces (JSF) 2.0, PrimeFaces 5.3, CSS
- **Backend Frameworks**: J2EE 7, Contexts and Dependency Injection (CDI), Java Persistance API (JPA)
- **Database**: Oracle MySQL 8.0 running on AWS RDS Aurora ([Download](https://www.mysql.com/downloads/))
- **Hosting**: Amazon Web Services (AWS)
- **Security**: TLS for data transmission
- **Source Control**: Git, Git Bash ([Download](https://git-scm.com/)) and GitHub
- **Misc Tools**: MySQL Workbench 8.0 ([Downloads](https://dev.mysql.com/downloads/workbench/)), Jaspersoft Studio 6.21.3 ([Downloads](https://community.jaspersoft.com/download-jaspersoft/community-edition/)), WSL: Windows Subsystem for Linux ([Installation Instructions](https://learn.microsoft.com/en-us/windows/wsl/install)), Docker ([Download](https://www.docker.com/)), Apache Maven ([Download](https://maven.apache.org/))

### **3.3 Deployment Artifacts**
- **Database**: Collection of SQL scripts that are executed on a MySQL database instance.
- **Application**: ZIP file which contains everything AWS Elastic BeanStalk needs to compile the Java code, build a Docker image, and run a Docker container inside of an EC2 instance
---

## **4. Application Design**
The application is designed around a Model/View/Controller paradigm.  The View is implemented with .xhtml and utilizes JSF templating to simplify the layout of all the pages.  The Controller is implemented with request and session scoped beans. When necessary, the Controllers call a session scoped bean that implements the business logic and maintains session state for each logged in user. The Model is implemented as a set of JpaControllers and Entity classes which handle the interacion with the database using objects.

The application is broken into several modules by function.  The following sections provide more details.

### **4.1 User Login**
The User login module displays a login form that accepts an Account Number and a PIN. The Account Number/PIN combination must exist in the ACCOUNT table for the login to be successful. An error message is displayed if the login is not successful. The following table lists the components that make up the User Login module.

|Component|Type|Layer|
|-|-|-|
|login.xhtml|web page|Presentation|
|com.svlogic.opoppr.Login|class|Presentation|
|com.svlogic.opoppr.session.UserSession|class|Application|
|com.svlogic.opoppr.controllers.AccountJpaController|class|Data|
|com.svlogic.opoppr.model.Account|class|Data|
|ACCOUNT|table|Data|

### **4.2 Dashboard**
The Dashboard displays a list of forms. Each entry displays the name of the form, its current status, and the last modified timestamp. NOTE: The dashboard will only show one form because there is typically only one form per account.

|Component|Type|Layer|
|-|-|-|
|home.xhtml|web page|Presentation|
|com.svlogic.opoppr.Home|class|Presentation|
|com.svlogic.opoppr.session.UserSession|class|Application|
|com.svlogic.opoppr.model.Account|class|Data|
|com.svlogic.opoppr.model.Form|class|Data|

### **4.3 Property Reporting**
Personal property is reported using a step-by-step wizard interface. Pages allow data entry into forms and tables. The data is validated when the user navigates off of the page.

|Component|Type|Layer|
|-|-|-|
|header.xhtml|web page|Presentation|
|section1.xhtml|web page|Presentation|
|section2.xhtml|web page|Presentation|
|section3.xhtml|web page|Presentation|
|section4.xhtml|web page|Presentation|
|section5.xhtml|web page|Presentation|
|validate.xhtml|web page|Presentation|
|com.svlogic.opoppr.forms.lat5.Header|class|Presentation|
|com.svlogic.opoppr.forms.lat5.Section1|class|Presentation|
|com.svlogic.opoppr.forms.lat5.Section2|class|Presentation|
|com.svlogic.opoppr.forms.lat5.Section3|class|Presentation|
|com.svlogic.opoppr.forms.lat5.Section4|class|Presentation|
|com.svlogic.opoppr.forms.lat5.Section5|class|Presentation|
|com.svlogic.opoppr.forms.lat5.SignatureAndVerification|class|Presentation|
|com.svlogic.opoppr.session.UserSession|class|Application|
|com.svlogic.opoppr.controllers.NoaPpLat5JpaController|class|Data|
|com.svlogic.opoppr.controllers.NoaPpLat5FilingJpaController|class|Data|
|com.svlogic.opoppr.controllers.NoaPpLat5InventoriesJpaController|class|Data|
|com.svlogic.opoppr.controllers.PropertyAssetJpaController|class|Data|
|com.svlogic.opoppr.model.NoaPpLat5|class|Data|
|com.svlogic.opoppr.model.NoaPpLat5Filing|class|Data|
|com.svlogic.opoppr.model.NoaPpLat5Inventories|class|Data|
|com.svlogic.opoppr.model.PropertyAsset|class|Data|

### **4.4 OPOPPR Administration**
The Administration feature of OPOPPR provides functionality to run reports, initialize the database for a new tax year, reset the status of a submitted form, cloase the database (disables all forms), and export submitted forms to a CSV so they can be input into the Orleans Assessor's tax system.

|Component|Type|Layer|
|-|-|-|
|homeAdmin.xhtml|web page|Presentation|
|close.xhtml|web page|Presentation|
|closeSuccess.xhtml|web page|Presentation|
|export.xhtml|web page|Presentation|
|exportSuccess.xhsml|web page|Presentation|
|initialize.xhxml|web page|Presentation|
|initializeSuccess.xhtml|web page|Presentation|
|lat5StatusReport.xhtml|web page|Presentation|
|resetFormStatus.xhtml|web page|Presentation|
|resetFormStatusConfirm.xhtml|web page|Presentation|
|Bill_Number_Status.jrxml|report|Presentation|
|com.svlogic.opoppr.admin.Close|class|Presentation & Application|
|com.svlogic.opoppr.admin.Export|class|Presentation & Application|
|com.svlogic.opoppr.admin.Initialize|class|Presentation & Application|
|com.svlogic.opoppr.admin.LAT5StatusReport|class|Presentation & Application|
|com.svlogic.opoppr.admin.ResetFormStatus|class|Presentation & Application|

---

## **5. Data Design**  
### **5.1 Data Entities and Relationships**
|Entity|Description|
|-|-|
|ACCOUNT|User account information used to authenticate users.|
|FORM|General information about a form that was submitted using OPOPPR.|
|FORM_TYPE|Lookup table of form types. Currently only LAT5 is supported.|
|STATUS|Lookup table of form status codes that indicate what state the form is in.|
|NOA_PP_LAT5|LAT5 General Information.|
|NOA_PP_LAT5_INVENTORIES|LAT5 Inventory declarations.|
|NOA_PP_LAT5_FILING|LAT5 property/asset declarations.|
|PROPERTY_ASSET|Lookup table of property/asset types.|

### **5.2 Database Schema**  
![OPOPPR Entity Relationship Diagram](<diagrams/OPOPPR - ERD.png>)

---

## **6. Security Design**  
### **6.1 Authentication and Authorization**  

Users are authenticated using username (ACCOUNT_ID) and password (PIN). Access to OPOPPR is controlleed by records in the ACCOUNT table. To log in, a user must have an Account ID and PIN issued to them by the Orleans Parish Assessors Office. A special account with ACCOUNT_ID of OPAADMIN has administrative privileges.

---
## **7. References**

* Core JavaServer Faces 3rd Edition - *David Geary & Cay Hortsmann* - Pretince Hall
* Java EE 7 Essentials - *Arun Gupta* - O'Reilly
* Docker Deep Dive: Zero to Docker in a single book - *Nigel Poulton*
* Maven: The Definitive Guide - *Sonatype* - O'Reilly
* [Prime Faces - Ultimate UI Framework](https://www.primefaces.org/)