#What's All This Then?
Right, guv, this is a place where I'll be keeping my growing collection of handy scripts for MoI - the [Moment of Inspiration](http://www.moi3d.com) modeler.

##FileToShapes
###What
This takes a file of points (either 2D or 3D) and sizes (in the range 0.0 - 1.0), and uses the data to create shapes in MoI.

If the points file is 3D, the shapes will be positioned centered at the points and scaled according to the size.

If the points file is 2D, there are a few options:

* the shapes can centered at the points on the XY plane and scaled according to the sizes
* the shapes can be located at the points on the XY plane and offset on the Z axis by the size
* both of the above

These shapes can be spheres, cylinders, cones, boxes, or boxes angled up onto their corners.

It expects one shape specification per line.

For a 2D file, that's:

    x, y, size

for a 3D file, that's:

    x, y, z, size

The file should be CSV or tab-delimited, although it also accepts spaces or semicolons as delimiters. Lines starting with a hash # are considered comments and are ignored.

###Installation
If MoI is running, quit the application.
Download and unzip the archive, or copy it down using whatever method makes sense to you (fork it, git clone it, etc.).

Place the FileToShape.js and FileToShape.htm files into the MoI command folder.
You can find the MoI command folder somewhere like C:\Program Files\Moi3d\commands on Windows installations, and in /Applications/MoI.app/drive_c/moi/commands under OSX (you will typically have to right-click on the MoI.app and choose "Show package contents" to see this folder).

Now you can start MoI.

To run the command, you can either use one of the clever External Script extensions (e.g., see [this collection of links](http://kyticka.webzdarma.cz/3d/moi/#PluginGallery)), or you can create a shortcut key and run it that way.

To create a shortcut key, click on "Options" within MoI. Click on the
"Shortcut keys" tab. Click the "Add" button. In the left-hand column, enter the key combination you want to use to launch FileToShapes. You could use, for example, Control-F. To do that, enter "Ctrl-F" in the left hand column, and "FileToShapes" in the right-hand column. Close the options panel, and now you will be able to launch the command using the Control-F keyboard combination.

###How
Create your data file using whatever means you choose. In this archive is a crappy little PHP program (photo_pixelator.php) that uses the Imagick library to convert lots of standard image file formats into the desired data file format.

When running MoI, use your short-cut to launch FileToShapes. Select your source file.

Use the drop down to choose what shape you want to generate at each point.

The checkbox options should be relatively self-explanatory.

* Check "Use val to vary shape size?" to make the script use the size value to alter the shape size. If your file is 3D, unchecking this won't work.
* Check "Use val to vary shape Z-axis offset?" to cause the shapes to move up the Z-axis based on the size. Best used with 2D data files.
* If you checked the Z-Axis offset, there will also be a field labeled "Coefficient." This is the value that the Z-Axis offset will be multiplied by, and defaults to 1.
* If you check "Select newly created shapes?", the newly created shapes will be selected after they are generated.

Click on "Done" and eventually, your shapes will be generated! I'm not sure about Windows, but unfortunately MoI running in the Wine environment on Mac OS doesn't utilize more than one CPU core, so something like the 50x50 examples below will take a few minutes (while on my machine, seven cores sit around bored). I should probably add a progress bar of sorts, if I could figure out how.

###Fergzample
There are four sample files:

* *spiral2d.csv* a simple 2D spiral ![2d spiral top view](http://fogbound.net/moi/spiral.png)
* *spiral3d.csv* for a 3d spiral ![3d spiral](http://fogbound.net/moi/spiral3d.png)

* *katze50x50.csv* for a 50x50 bitmap conversion ![Katze detail](http://fogbound.net/moi/katze_cones.png)![Katze](http://fogbound.net/moi/katze_cones2.png)

* *katze50x50i.csv* for the "inverse" 50x50 bitmap conversion - image shows cylinders boolean subtracted from a box ![Katze](http://fogbound.net/moi/katze_punchout.png)

