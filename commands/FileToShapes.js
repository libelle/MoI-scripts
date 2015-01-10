// config: norepeat

function generateSpheres(pt_list, is3d)
{
    var obs = moi.geometryDatabase.createObjectList();
    var factory = moi.command.createFactory('sphere');

    for (var i = 0; i < pt_list.length; i++)
    {
        var p = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d ? pt_list[i][2] : 0));
        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));
        factory.setInput(0, true);
        factory.setInput(1, frame);
        factory.setInput(3, (is3d ? pt_list[i][3] : pt_list[i][2])/2);

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
        var p = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d ? pt_list[i][2] : 0));
        var p2 = moi.vectorMath.createPoint(pt_list[i][0], pt_list[i][1], (is3d ? pt_list[i][2] : 0) + 1);
        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));

        factory.setInput(1, frame);
        factory.setInput(3, (is3d ? pt_list[i][3] : pt_list[i][2])/2);
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
        var z = (is3d ? pt_list[i][2] : 0.0);
        var d = (is3d ? pt_list[i][3] : pt_list[i][2]);
        var p = moi.vectorMath.createPoint((x - d / 2), (y + d / 2), z);

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

function newGenerateCubes(pt_list, is3d, angled)
{
    var obs = moi.geometryDatabase.createObjectList();
    var factory = moi.command.createFactory('box');

    for (var i = 0; i < pt_list.length; i++)
    {
        var x = pt_list[i][0];
        var y = pt_list[i][1];
        var z = (is3d ? pt_list[i][2] : 0.0);
        var d = (is3d ? pt_list[i][3] : pt_list[i][2]);
        var p = moi.vectorMath.createPoint((x - d / 2), (y + d / 2), (z - d / 2));

        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));

        factory.setInput(0, frame);
        factory.setInput(2, d);
        factory.setInput(3, d);
        factory.setInput(4, d);

        if (angled)
        {
            var tobj = factory.calculate().item(0);
            var newobjs = moi.geometryDatabase.createObjectList();
            newobjs.addObject(tobj);
            var bb = tobj.getBoundingBox();
            var axis1 = moi.vectorMath.createPoint(
                bb.center.x - bb.xLength / 2,
                bb.center.y - bb.yLength / 2,
                bb.center.z + bb.zLength / 2);
            var axis2 = moi.vectorMath.createPoint(
                bb.center.x + bb.xLength / 2,
                bb.center.y + bb.yLength / 2,
                bb.center.z + bb.zLength / 2);
            var rot_fact = moi.command.createFactory('rotateaxis');
            rot_fact.setInput(0, newobjs);
            rot_fact.setInput(1, axis1);
            rot_fact.setInput(2, axis2);
            // damn, this is why I can't do Physics. "Intuition" convinced me that this
            // should be 45° until I finally understood it.
            rot_fact.setInput(3, 90 - 180 * Math.atan(1 / Math.sqrt(2)) / Math.PI);
            rot_fact.setInput(6, false);

            obs.addObject(rot_fact.calculate().item(0));
        }
        else
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
    var is3d = false;

    var f = moi.filesystem.openFileStream(filename, 'r');

    var pt_list = [];
    var first = true;

    while (!f.AtEOF)
    {
        var line = f.readLine();
        if (line.length > 0 && line[0] != '#')
        {
            var split_coord = line.split(/[,\t;\s]+/);
            var coord = [];
            for (var i = 0; i < split_coord.length; ++i)
            {
                if (split_coord[i] != '')
                    coord.push(parseFloat(split_coord[i]));
            }
            if (first)
            {
                if (coord.length == 4)
                    is3d = true;
                first = false;
            }
            if ((!is3d && coord.length == 3 && coord[2] > 0) ||
                (is3d && coord.length == 4 && coord[3] > 0))
                pt_list.push(coord);
        }
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
    else if (shape == 'cubes')
        obj_list = newGenerateCubes(pt_list, is3d, false);
    else if (shape == 'angled')
        obj_list = newGenerateCubes(pt_list, is3d, true);

    if (select)
        obj_list.setProperty('selected', true);
    moi.geometryDatabase.addObjects(obj_list);
}

FileToShapes();
