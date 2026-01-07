The project name is pictho but the comercial name is Pict'Oh
Only front app, use workers to have off line
React app. Use material as UI lib. And enabled tailwind, but use it only if realy necessary. Use valtio as state manager.
Use material icon.
use nx to manage the project to have monorepository in case I want add netxjs server side later
Off line totally, just first download of the app, loader, download the lib of picture
the app is targeting tablet only
It should only display on portrait mode, even if the user turn the tablet
The UI use french language. No need of internationnalisation for future other language
the app purpose is to display 24 squares, 6 columns and 4 rows. The squares angles are rounded.
The user can select from the /assets/pictures/* a picture for each square
each square can be empty.
When clicking 5 time on a square, an edit mode is enabledm then When the user click on a square, a modal open with the list of picture to select, a text field allow to filter. By default
only the favorite picture are displayed. Never display all the picture at once, because is too many picture.
For each picture a text is associated. By default the text is the file name. An optin option for the picture allow to
display above the picture or not the text.
The image could also open a new page. by Default the 'Home' page is created. In edit mode there is a band on top of the square with :
- new page creation button (a popup allow to enter the page name, then the page is open)
- manage pages button (a popup with the list of page, allow to delete a page, rename it, open it)
- close edit mode button
Each time the user make a change the config is saved in the local storage of the browser.
When the user click on a square in normal mode, the associated text is read, using a local text to speech model,
with one female voice preloaded. When the app is loaded the first time, the text to speech model is downloaded in background.
During the first open, a loader with percent for the progress is display when all for offline is downloaded (front code, 
picto libs, text to speech model, etc...).


