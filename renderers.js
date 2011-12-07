function WorldRenderer(canvas, beach, forest, mountain)
{
	WorldRenderer.prototype.drawArray = function(mapObj)
	{
		var str = '';
		for(var i=0; i < mapObj.size*mapObj.size; ++i)
		{
			if(i%mapObj.size == 0)str += '<br/>'
			str += (mapObj.map[i] === undefined ? '_':mapObj.map[i])+', ';
		}
		document.write(str);
	}

	WorldRenderer.prototype.drawPixelated = function(mapObj)
	{
		canvas.width = mapObj.size;
		canvas.height = mapObj.size;
		var ctx = canvas.getContext('2d');
		var imgd = ctx.getImageData(0, 0, mapObj.size, mapObj.size);
		var pixm = imgd.data;
		for(var y=0; y < mapObj.size; ++y)
		{
			for(var x=0; x < mapObj.size; ++x) 
			{
				var c = mapObj.map[(y*mapObj.size)+x];
				var incl = y < (mapObj.size-1) ? (c - mapObj.map[((y+1)*mapObj.size)+x])*3 : 0;
				var wc = Math.floor(Math.max(Math.min(c-incl, 255), 0));
				var rgb = [0, 0, 0];
				if(c < water)rgb = [0, 0, c+92];
				else if(c >= water && c < beach)rgb = [255,(c+110),c+50];
				else if(c >= beach && c < forest)rgb = [0, wc/1.5, 0];
				else if(c >= forest && c < mountain)rgb = [wc/1.2, wc/1.2, wc/1.2];
				else if(c >= mountain)rgb = [wc, wc, wc];
				var koo = y*mapObj.size*4 + (x*4);
				pixm[koo + 0] = rgb[0];
				pixm[koo + 1] = rgb[1];
				pixm[koo + 2] = rgb[2];
				pixm[koo + 3] = 255;
			}
		}
		ctx.putImageData(imgd, 0, 0);
	}
	
	WorldRenderer.prototype.drawTiled = function(worldObj, tileSize)
	{
		var size = worldObj.terrain.size;
		canvas.width = size*tileSize;
		canvas.height = size*tileSize;
		var ctx = canvas.getContext('2d');
		for(var y=0; y < size; ++y)
		{
			for(var x=0; x < size; ++x)
			{
				var pt = worldObj.getSquare(x, y);
				//var pt = mapObj.map[(y*mapObj.size)+x];
				
				var c = Math.floor(pt.elevation);
				var incl = y < (size-1) ? (pt.elevation - worldObj.getSquare(x, y+1).elevation)*3 : 0;
				
				var rgb = [0,0,0];
				
				if(pt.temperature !== false && pt.temperature < 1)
				{
					var clr = 255 - pt.temperature*10;
					rgb = [clr,clr,255];
				}
				else if(pt.type === 'ocean' || pt.type === 'edge' || pt.type === 'water')rgb = [0,0,clampValue(130, 160, c+92)];
				else
				{
					var wc = Math.floor(Math.max(Math.min(pt.elevation-incl, 255), 0));
					
					if(pt.elevation < beach)rgb = [255,clampValue(180, 240, c+110),clampValue(180, 250, c+50)];
					else if(pt.elevation >= beach && pt.elevation < forest)rgb = [0,clampValue(60, 110, Math.floor(wc/1.5)),0];
					else if(pt.elevation >= forest && pt.elevation < mountain)
					{
						var val = clampValue(100, 210, Math.floor(wc/1.2));
						rgb = [val,val,val];
					}
					else if(pt.elevation >= mountain)rgb = [wc,wc,wc];
				}
				ctx.fillStyle = 'rgb('+rgb.join(',')+')';
				ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
			}
		}
	}
}