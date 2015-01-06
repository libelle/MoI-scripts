// config: norepeat

function generateSpheres(pt_list, is3d)
{
    var obs = moi.geometryDatabase.createObjectList();
    var factory = moi.command.createFactory('sphere');

    for (var i = 0; i < pt_list.length; i++)
    {
        var p = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d?pt_list[i][2]:0));
        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));
        factory.setInput(0, true);
        factory.setInput(1, frame);
        factory.setInput(3, (is3d?pt_list[i][3]:pt_list[i][2]));

        obs.addObject(factory.calculate().item(0));
        factory.reset();
    }
    factory.cancel();

    return obs;
}

function generateConesOrCylinders(pt_list, is3d, is_cone)
{
    var obs = moi.geometryDatabase.createObjectList();
    var factory = moi.command.createFactory((is_cone ? 'cone' : 'cylinder'));
    for (var i = 0; i < pt_list.length; i++)
    {
        var p = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d?pt_list[i][2]:0));
        var p2 = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d?pt_list[i][2]:0)+1);
        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));

        factory.setInput(1, frame);
        factory.setInput(3, (is3d?pt_list[i][3]:pt_list[i][2]));
        factory.setInput(4, p2);

        obs.addObject(factory.calculate().item(0));
        factory.reset();
    }
    factory.cancel();
    return obs;
}

function generateCubes(pt_list, is3d)
{
    var obs = moi.geometryDatabase.createObjectList();
    var factory = moi.command.createFactory('box');

    for (var i = 0; i < pt_list.length; i++)
    {
        var x = pt_list[i][0];
        var y = pt_list[i][1];
        var z = (is3d?pt_list[i][2]:0.0);
        var d = (is3d?pt_list[i][3]:pt_list[i][2]);
        var p = moi.vectorMath.createPoint((x - d/2),(y + d/2),z);

        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));

        factory.setInput(0, frame);
        factory.setInput(2, d);
        factory.setInput(3, d);
        factory.setInput(4, d);
        obs.addObject(factory.calculate().item(0));
        factory.reset();
    }
    factory.cancel();
    return obs;
}

function FileToShapes()
{
    var filename = moi.filesystem.getOpenFileName('Choose a CSV file', 'Point files (*.txt, *.csv)|*.txt;*.csv|All files (*.*)|*.*');
    if (filename == '')
        return; // Cancel.

    moi.ui.beginUIUpdate();
    moi.ui.showUI('file_prompt');
    moi.ui.showUI('import_options');
    moi.ui.endUIUpdate();
    var dialog = moi.ui.commandDialog;

    while (true)
    {
        if (!dialog.waitForEvent())
            return;
        if (dialog.event == 'done')
            break;
    }

    var shape = moi.ui.commandUI.shape.value;
    var select = moi.ui.commandUI.select.value;
    var is3d = moi.ui.commandUI.zplane.value;

    var f = moi.filesystem.openFileStream(filename, 'r');

    var pt_list = [];

    while (!f.AtEOF)
    {
        var split_coord = f.readLine().split(/[,\t;\s]+/);
        var coord = [];
        for (var i = 0; i < split_coord.length; ++i)
        {
            if (split_coord[i] != '')
                coord.push(parseFloat(split_coord[i]));
        }
        if ((! is3d && coord.length == 3 && coord[2] > 0) ||
            (is3d && coord.length == 4 && coord[3] > 0))
            pt_list.push(coord);
    }
    f.close();

    if (pt_list.length == 0)
        return;

    var obj_list;
    if (shape == 'spheres')
        obj_list = generateSpheres(pt_list, is3d);
    else if (shape == 'cylinders')
        obj_list = generateConesOrCylinders(pt_list, is3d, false);
    else if (shape == 'cones')
        obj_list = generateConesOrCylinders(pt_list, is3d, true);
    else if (shape == 'cubes' || shape == 'angled')
        obj_list = generateCubes(pt_list, is3d);


    if (shape == 'angled')
    {
        for (var i=0;i<obj_list.length;i++)
        {
            var tcube = obj_list.item(i);
            var newobjlist = moi.geometryDatabase.createObjectList();
            objlist.addObject( tcube );
            var center = tcube.getBoundingBox().center;
            var taxis = moi.vectorMath.createPoint(center.x, center.y, 2*center.z);
            var rot_fact = moi.command.createFactory( 'rotateaxis' );
            rot_fact.setInput(0, objlist);
            rot_fact.setInput(1, center);
            rot_fact.setInput(2, taxis);
            rot_fact.setInput(3, 45);
            rot_fact.setInput(6, false);
            rot_fact.commit();
        }
    }
    else
    {
        if (select)
            obj_list.setProperty('selected', true);
        moi.geometryDatabase.addObjects(obj_list);
    }



}

FileToShapes();
