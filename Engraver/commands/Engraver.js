// config: norepeat

function processLine(pt_list, row, smooth)
{
    var rects = moi.geometryDatabase.createObjectList();
    var ext = moi.geometryDatabase.createObjectList();
    var r_factory = moi.command.createFactory('rectcenter');
    var l_factory = moi.command.createFactory('loft');

    for (var i = 0; i < pt_list.length; i++)
    {
        var p = moi.vectorMath.createPoint(row, i, 0);

        var frame = moi.vectorMath.createFrame(
            p,
            moi.vectorMath.createPoint(1, 0, 0),
            moi.vectorMath.createPoint(0, 0, 1));

        r_factory.setInput(0, frame);
        r_factory.setInput(1, p);
        r_factory.setInput(2, pt_list[i]);
        r_factory.setInput(3, 1.0);
        rects.addObject(r_factory.calculate().item(0));
        r_factory.reset();
    }
    r_factory.cancel();

    l_factory.setInput(0,rects);
    l_factory.setInput(2,(smooth?'normal':'straight'));
    l_factory.setInput(3, true); // cap ends
    l_factory.setInput(5,(smooth?'Auto':'Exact')); // profile type
    var k = l_factory.calculate();
    moi.geometryDatabase.addObjects(k);
    l_factory.cancel();

}

function Engraver()
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
        if (dialog.event)
            if (dialog.event == 'done')
                break;
    }

    moi.ui.commandUI.statusline.innerHTML  = 'Working...';
    var style = moi.ui.commandUI.style.value;

    var f = moi.filesystem.openFileStream(filename, 'r');

    var pt_list = [];
    var row = 0;

    var obj_list;
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
            obj_list = processLine(coord,row,(style=='smooth'));
            row++;
        }
    }
    f.close();
    moi.ui.commandUI.statusline.innerHTML  = '';
}

Engraver();
