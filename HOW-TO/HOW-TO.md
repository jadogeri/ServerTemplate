# How-To

## Database

### Change database schema
Follow these steps to make changes to the OPOPPR database schema. Following these steps will ensure that the database design is kept up to date and that you can test your changes before making changes to the Test and Prod databases.
1. Open MySQL Workbench.
2. **File | Open Model...**, browse to ```<repo_base>/Database```, and select ```opoppr.mwb```.
3. The tables and views in the schema are shown in the **Physical Schemas** section. Update tables by double-clicking on the table you want to modify.  Add a new table by double-clicking **Add Table**.
4. Update the **EER Diagram** when adding or removing tables to maintain the visual model of the database.
5. Save the model when you are done.
6. **File | Export Forward SQL Create Script...** to generate the script that will create the entire database. Save the script to ```<repo_base>/opoppr/database/initdb.d/1_opoppr.sql```. Click **Replace** to overwrite the existing file.
7. Run the script on your local MySQL instance (this will delete all of your local data) or restart the opoppr containers with the ```docker compose up -d``` command (you will have to run ```docker compose down -v``` do delete the local database volume first).
8. Commit your changes to git and push to GitHub.

### Reset the database
1. Open MySQL Workbench.
2. Connect to the database instance you want to reset.
3. **File | Open SQL Script...**, browse to ```<repo_base>/opoppr/database/initdb.d```, and select ```1_opoppr.sql```. The contents of the script file will appear in a new tab.
4. Click on the ![lightening bolt](images/lightening-bolt.png) icon in the toolbar to run the entire script.

### Apply model changes to an existing database instance
1. Open MySQL Workbench.
2. **File | Open Model...**, browse to ```<repo_base>/Database```, and select ```opoppr.mwb```.
3. **Database | Synchronize Model...**
4. On the **Set Parameters for Connecting to DBMS** page, select the Stored Connection that corresponds to the database instance you want to update, fill in the username and password fields if necessary, and click **Next**.
5. Leave all boxes unchecked on the **Select Options for Synchronization Script** page and click **Next**.
6. The **Connect to DBMS and Fetch Information** page will show a progress bar as the database information is loaded. The page will show **Execution Completed Successfully / Fetch Finished** when the load is complete.  Click **Next**.
7. On the **Select Schema to be Synchronized** page, place a check mark next to **opoppr** and click **Next**.
8. The **Retrieve and Reverse Engineer Schema Objects** page will generate the update script.  The page will show **Retrieval Completed Successfully. / Finsiehd.** when it is done.  Click **Next**.
9. The **Model and Database Differences** page will show a list of differences between the model and the database. You can select the rows in the list view to see the script that was generated for each schema object. The generated script will have alot of ```ALTER``` statements that are harmless (e. g. remove and re-add foreign key references), so the script is safe to run without causing issues. Click **Next**.
10. The **Preview Database Changes to be Applied** page displays the complete script that was generated to sync the database with the model. In addition to ```ALTER``` and ```CREATE``` commands that make changes to the database, there will also be ```ALTER``` commands that remove constraints at the beginning of the file and that put them back at the end of the file. These additional ```ALTER``` commands are harmless and prevent script errors that will occur if certain constraints are enforced while the database is being updated. Click **Execute** to run the script.
11. The **Progress of Model and Database Synchronization** page will show the status of the script run. You should see the text **Synchronization Completed Successfully / Finished** if the script ran successfully. Click **Close**.
12. **File | Save Model** to save the model. This step is necessary because MySQL Workbench saves the state of the last synchronization in ```opoppr.mwb``` file rather than relying solely on the differences between the model and the target database instance.
13. Changes to the data in the lookup tables (e. g. USER_ROLE, USER_STATUS, PROPERTY_ASSET, STATUS, USER_CHANGE_TYPE, and BUSINESS_TYPE) must be applied manually to the target database.

## Builds and Deployments

### Build

1. Develop code in feature branches with the name prefixed with ```feature/```.
2. Commit changes and push to GitHub regularly while developing the feature. The code will be compiled by GitHub to ensure there are no errors.

### Pull Requests

1. When your feature is ready to be merged to master, create a **Pull Request** (PR) in GitHub.
2. One of the requirements to merge the **Pull Request** is that the build succeeds; therefore, GitHub will compile the code when the **Pull Request** is created and if any new code is committed and pushed to the source branch while the PR is open.

### Deploy to Test

OPOPPR is automatically deployed to the test environment whenever code is committed and pushed to the ```master``` branch. You can commit code directly to ```master```, but it is recommended to develop bigger changes in a ```feature/``` branch and use the **Pull Request** process to merge those changes into ```master```. When merging to master via a **Pull Request**, always use **Squash Commits** to keep the ```master``` branch's commit history as clean is possible. If the new code requires database changes, be sure to go through the steps in [Apply model changes to an existing database instance](#apply-model-changes-to-an-existing-database-instance) before pushing the code to the ```master``` branch to apply database changes to the test environment. You can check the status of the deployment on the Elastic Beanstalk page of the AWS Console. The Health column of the **opoppr-test** environment will show **Ok** when the deployment is complete.

### Deploy to Production

OPOPPR is deployed to the production environment whenever a **Release** is created in GitHub.

1. If this release requires database changes, go through the steps in [Apply model changes to an existing database instance](#apply-model-changes-to-an-existing-database-instance) before creating the release to apply database changes to the production environment.
2. Navigate your browser to https://github.com/SVLogic2021/orleans-parish-online-personal-property-reporting.
3. Click [Releases](https://github.com/SVLogic2021/orleans-parish-online-personal-property-reporting/releases) on the right-hand side of the page.
4. The **Releases** page will show a list of previous releases.  Make note of the release tagged ```Latest```. The format of release namaes is [YEAR].[RELEASE_NUMBER] (e.g. 2025.3). The next release will be named [YEAR].[RELEASE_NUMBER+1] (e. g. 2025.4).
5. Click **Draft a new release**.
6. Click **Chose a tag** and type type the name of the new release into the text box. The drop down will show a list of previous releases, but do not select any of these since we want to create a new tag. When you type the new name into the text box, the list will change to ```+ Create a new tag: [release name]```. Click on this item to create the new tag.
7. Set **Target** to ```master```.
8. Set **Previous tag** to ```auto```.
9. Click **Generate release notes**.  Doing this will create release notes that describe all of the changes (commits) made since the last release. The name of the release will also be filled in using the tag we just created.
10. Click **Publish release** to create and publish the release and to begin the deployment process.
11. You can check the status of the deployment on the Elastic Beanstalk page of the AWS Console. The health column of the **opoppr-prod** enviornment will show **Ok** when the deployment is complete.

## General

### View OPOPPR Logs

1. Navigate your browser to the [OPOPPR AWS Console](https://990906569766.signin.aws.amazon.com/console).
2. Enter your username and password.
3. Click **Elastic Beanstalk** in the **Recently Visited** section or type ```Elastic Beanstalk``` into the search box at the top of the page.
4. Click **Environments** on the left hand side of the page if necessary. A list showing the opoppr enviornments should appear.
5. Click on the name of the environment whose logs you want to view.
6. Click on the **Logs** tab.
7. Click **Request Logs** and select **Full** from the dropdown list.
8. A zip file that contains the logs will be generated on the server. You will have a wait a few seconds for this process to complete.
9. Click **Download** to download the zip file to your workstation. A file names BundleLogs-[LOG_ID].zip will be downloaded.
10. Unpack the zip file to see the files within.
11. Navigate to ```var/log/eb-docker/containers/eb-current-app``` to view the application logs.
12. Navigate to ```var/log/nginx``` to view the contents of the nginx access.log and error.log.
13. Browse the other files in the zip to see logs related to AWS and Docker.
