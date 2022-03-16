# elderberry-backend

[Intro](#Intro) <br>

Technical Details 
- [Navigation](#Navigating-this-Repository) <br>
- [Tech Stack](#Technical-Stack) <br>
- [Db Design](#Database-Design) <br>

Try it out!
- [Report demo](#Report-Demo)<br>

## Intro
Repository for Flask server running on Huawei Elastic Cloud Server (ECS). Provides backend routes for Elderberry project and runs Food Detection AI, Sentiment Analysis, Anomaly Detection and the generation of monthly reports.

The monthly report system is hosted at http://119.13.104.214:80/customizeReport.

## Navigating this Repository
The file `app.py` contains the list of all routes. It redirects each set of relavent routes (i.e. bluetooth routes) to the corresponding file in `/routes`, for instance `/routes/bluetooth.py`. That file processes the query and uses `/hctools/bluetooth.py` (hctools referring to Huawei Cloud tools) to invoke GaussDB, OBS or otherwise.

The `/mockData` files help generate mock data for the back-end reports and the front-end app.

## Technical Stack
![This is an image](readme/chart.png)

## Database Design
![This is an image](readme/database.png)

## Report Demo
To demonstrate different kind of reports that can be generated, we created a webpage to try generating the reports for different profiles. This shows the different type of reports that can be made based on the user. <br>
Try it out [here](http://119.13.104.214)
