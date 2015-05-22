##Engraver
###What
This takes a file of containing a grid of sizes (in the range 0.0 - 1.0), and uses the data to create ridges in MoI, suitable for 3D printing.

The expected file format is just rows and columns of values.

The file should be CSV or tab-delimited, although it also accepts spaces or semicolons as delimiters. Lines starting with a hash # are considered comments and are ignored.

###Installation
If MoI is running, quit the application.
Download and unzip the archive, or copy it down using whatever method makes sense to you (fork it, git clone it, etc.).

Place the Engraver.js and Engraver.htm files into the MoI command folder.
You can find the MoI command folder somewhere like C:\Program Files\Moi3d\commands on Windows installations, and in /Applications/MoI.app/drive_c/moi/commands under OSX (you will typically have to right-click on the MoI.app and choose "Show package contents" to see this folder).

Now you can start MoI.

To run the command, you can either use one of the clever External Script extensions (e.g., see [this collection of links](http://kyticka.webzdarma.cz/3d/moi/#PluginGallery)), or you can create a shortcut key and run it that way.

To create a shortcut key, click on "Options" within MoI. Click on the
"Shortcut keys" tab. Click the "Add" button. In the left-hand column, enter the key combination you want to use to launch Engraver. You could use, for example, Control-F. To do that, enter "Ctrl-F" in the left hand column, and "Engraver" in the right-hand column. Close the options panel, and now you will be able to launch the command using the Control-F keyboard combination.

###How
Create your data file using whatever means you choose. In this archive is a crappy little PHP program (photo_engraver_data.php) that uses the Imagick library to convert lots of standard image file formats into the desired data file format.

When running MoI, use your short-cut to launch Engraver. Select your source file.

Use the drop down to choose whether you want smooth ridges or angular ridges. Angular ridges use straight lines to connect the sections, whereas smooth ridges use curves. See examples below.

* Angular detail: ![Detail, angular](http://fogbound.net/moi/engraving-angular.png)
* Smooth detail: ![Detail, smooth](http://fogbound.net/moi/engraving-smooth.png)

Click on "Done" and eventually, your ridges will be generated! I'm not sure about Windows, but unfortunately MoI running in the Wine environment on Mac OS doesn't utilize more than one CPU core, so something like the 50x50 examples below will take a few minutes (while on my machine, seven cores sit around bored). I should probably add a progress bar of sorts, if I could figure out how.

###Fergzample
There is one sample file:

* *dorothy.csv* an example of a 40x50 portrait image converted to an engraving ![engraving example](http://fogbound.net/moi/engraving.png)

