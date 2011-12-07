function Map(size)
{
	var self = this;

	this.size = size;
	this.map  = [];
	this.min  = false;
	this.max  = false;
	
	this.normalize = function(ceil)
	{
		if(this.min !== false && this.max !== false)
		{
			var diff = this.max-this.min;
			var size = this.map.length;
			for(var i=0; i < size; ++i)
				this.map[i] = Math.round((this.map[i]-this.min) / diff * ceil);
		}
	}
	
	this.normalizeValue = function(i, ceil)
	{
		var value = this.map[i];
		if(this.min !== false && this.max !== false)
		{
			var diff = this.max-this.min;
			value = Math.round((value-this.min) / diff * ceil);
		}
		return value;
	}
	
	this.average = function()
	{
		var size = this.map.length - this.size;
		for(var i=this.size; i < size; ++i)
			this.map[i] = (this.map[i+1]+this.map[i-1]+this.map[i-this.size]+this.map[i+this.size])/4;
	}
	
	this.midpoint = function(size, disp)
	{
		function fill(stl, size, dh)
		{
			if(size > 1)
			{
				var subsize = size/2;
				var str = stl+size; //Find the top right of the square
				var sbl = stl+(size*self.size);//Find the bottom left of the square
				var sbr = sbl+size;//Find the bottom right of the square.
				var sc = stl+subsize+(self.size*subsize);//Find the center of the square
				
				var d2 = dh/2;
			
				var dt = stl+subsize; //Find the top corner of the diamond
				var dl = sc-subsize; //Find the left corner of the diamond
				var dr = sc+subsize; //Find the right corner of the diamond
				var db = sbl+subsize //Find the bottom corner of the diamond
			
				//Calculate the middle value of the square
				self.map[sc] = Math.abs((self.map[stl] + self.map[str] + self.map[sbl] + self.map[sbr])/4 + Math.random() * dh - d2);
				if(self.map[sc] < self.min || self.min === false)self.min = self.map[sc];
				if(self.map[sc] > self.max || self.max === false)self.max = self.map[sc];
				
				//Calculate the corner values of the diamond
				if(self.map[dt] === undefined)
				{
					self.map[dt] = Math.abs((self.map[stl] + self.map[str])/2 + Math.random() * dh - d2);
					if(self.map[dt] < self.min || self.min === false)self.min = self.map[dt];
					if(self.map[dt] > self.max || self.max === false)self.max = self.map[dt];
				}
				if(self.map[db] === undefined)
				{
					self.map[db] = Math.abs((self.map[sbl] + self.map[sbr])/2 + Math.random() * dh - d2);
					if(self.map[db] < self.min || self.min === false)self.min = self.map[db];
					if(self.map[db] > self.max || self.max === false)self.max = self.map[db];
				}
				if(self.map[dl] === undefined)
				{
					self.map[dl] = Math.abs((self.map[stl] + self.map[sbl])/2 + Math.random() * dh - d2);
					if(self.map[dl] < self.min || self.min === false)self.min = self.map[dl];
					if(self.map[dl] > self.max || self.max === false)self.max = self.map[dl];
				}
				if(self.map[dr] === undefined)
				{
					self.map[dr] = Math.abs((self.map[str] + self.map[sbr])/2 + Math.random() * dh - d2);
					if(self.map[dr] < self.min || self.min === false)self.min = self.map[dr];
					if(self.map[dr] > self.max || self.max === false)self.max = self.map[dr];
				}
				
				var nh = dh/disp;
				
				fill(stl, subsize, nh);
				fill(str-subsize, subsize, nh);
				fill(sc-subsize, subsize, nh);
				fill(sc, subsize, nh);
			}
		}
		for(var i=0; i < size; ++i)
		{
			this.map[i] = 0;
			this.map[i*size] = 0;
			this.map[(i*size)+(size-1)] = 0;
			this.map[(size*(size-1))+i] = 0;
		}
		fill(0, size-1, 1);
	}
	
	this.sortIndexes = function(type)
	{
		function swap(array, indexes, a, b)
		{
			var tmp = array[a];
			array[a] = array[b];
			array[b] = tmp;
			
			tmp = indexes[a];
			indexes[a] = indexes[b];
			indexes[b] = tmp;
		}
		
		function partition(array, indexes, begin, end, pivot)
		{
			var piv = array[pivot][type];
			swap(array, indexes, pivot, end-1);
			var store = begin;
			for(var i = begin; i < end-1; ++i) 
			{
				if(array[i][type] <= piv) 
				{
					swap(array, indexes, store, i);
					++store;
				}
			}
			swap(array, indexes, end-1, store);
			return store;
		}
		
		function qsort(array, indexes, begin, end)
		{
			if(end-1 > begin) 
			{
				var pivot = begin + Math.floor(Math.random() * (end-begin));
				pivot = partition(array, indexes, begin, end, pivot);
		
				qsort(array, indexes, begin, pivot);
				qsort(array, indexes, pivot+1, end);
			}
		}

		this.sortedIndexes = [];
		var size = this.map.length;
		for(var i=0; i < size; ++i)
			this.sortedIndexes[i] = i;
		
		//Copy the map so that we can sort it with out touching the original 
		var sortMap = this.map.slice();
		qsort(sortMap, this.sortedIndexes, 0, this.map.length);
		
		sortMap = []; //Attempt to clean up the large sorted map that we don't need
	}
}

Drainage.prototype = new Map;
function Drainage(size)
{
	Map.call(this, size);
	this.midpoint(size, 1.5);
	this.normalize(100);
}

Temperature.prototype = new Map;
function Temperature(terrain, oceanLevel)
{
	var size = terrain.size;
	Map.call(this, size);
	
	for(var lat=0; lat < size; ++lat)
	{
		var base = (lat/size)*255;
		for(var lon=0; lon < size; ++lon)
		{
			var scale = (terrain.map[lon*size+lat].elevation)/2;
			var temp = Math.round(base - scale);
			if(temp < this.min || this.min === false)this.min = temp;
			if(temp > this.max || this.max === false)this.max = temp;
			this.map[lon*size+lat] = temp;
		}
	}
}

Terrain.prototype = new Map;
function Terrain(drainage, ocean)
{
	Map.call(this, drainage.size);
	this.midpoint(drainage.size, 1.5);
	this.average();
	this.normalize(255);
	
	var self = this;
	
	var size = this.map.length;
	for(var i=0; i < size; ++i)
	{
		var elevation = this.map[i];
		//Put into vars for efficiency 
		var imod = i % this.size;
		var sizeminone = this.size-1;
		if(i < this.size || i > (this.size*(sizeminone)) || imod == 0 || imod == sizeminone)this.map[i] = {type: 'edge', elevation: 0, drainage: 0, name: 'The Edge of the World'};
		else if(elevation < ocean)this.map[i] = {type: 'ocean', elevation: elevation, drainage: 0, name: 'The Great Sea'};
		else this.map[i] = {type: 'land', elevation: elevation, drainage: drainage.map[i], name: 'land'};
	}
	
	//Returns the index of the lowest elevation point that is adjacent 
	//to the specified index and not in the list of closed indexes. If 
	//there are no lower elevations then it will lower the elevation of
	//one of the adjacent indexes.
	function getLowestElevationIndex(index, closed, force)
	{
		var lowest = self.map[index].elevation;
		//If we are at minimum elevation, quit.
		if(lowest == 0 && !force)return -1;
			
		var newindex = index;
		var next = [index-self.size, index+self.size, index-1, index+1]; //top, bottom, left, right
		for(var i=0; i < 4; ++i)
		{
			if(lowest > self.map[next[i]].elevation && arraySearch(next[i], closed) < 0)
			{
				newindex = next[i];
				lowest = self.map[next[i]].elevation;
			}
		}
		//If we couldn't find a lower elevation
		if(newindex === index)
		{
			//Find the lowest elevation that hasn't already been used.
			var smallest = next[randomRange(0, 3)];
			var found = false;
			for(var i=0; i < 4; ++i)
			{
				if(self.map[smallest].elevation > self.map[next[i]].elevation && arraySearch(next[i], closed) < 0)
				{
					smallest = next[i];
					found = true;
				}
			}
			if(!found && !force)return -1;
			newindex = smallest;
			
			//Adjust the elevation so that it is lower.
			//Unless it is at the minimum then we just keep it at the minimum.
			self.map[newindex].elevation = lowest - randomRange(0, 1);
		}
		closed.push(newindex);
		return newindex;
	}
	
	function createLake(index, threshold, moves)
	{
		if(moves < 0 || index < self.size || index > self.map.length-self.size)return;
		var type = self.map[index].type;
		var elevation = self.map[index].elevation + threshold;
		if(type === 'water' || type === 'ocean' || type === 'edge')return;
		
		self.map[index].type = 'water';
		self.map[index].drainage = 0;
		
		if(self.map[index-1].elevation < elevation)createLake(index-1, threshold, moves-1);
		if(self.map[index+1].elevation < elevation)createLake(index+1, threshold, moves-1);
		if(self.map[index-self.size].elevation < elevation)createLake(index-self.size, threshold, moves-1);
		if(self.map[index+self.size].elevation < elevation)createLake(index+self.size, threshold, moves-1);
	}
	
	this.runErosion = function(elevationPercent, pathCount)
	{
		//Sort the map indexes by elevation 
		this.sortIndexes('elevation');
		//Determine the index of the highest elevation
		var max = this.sortedIndexes.length-1;
		//Determine the index of the lowest elevation within our range percentage
		var min = max - Math.round(max*elevationPercent);
		//If a path count wasn't set determine one based on the size of the map
		if(pathCount == undefined)pathCount = Math.sqrt(this.size-1)*2;
		//This list of indexes already visited
		var closed = [];
		var index = -1;
		
		for(var ctr=0; ctr < pathCount; ++ctr)
		{		
			closed = [];
			index = this.sortedIndexes[randomRange(min, max)];
			while(index >= 0 && self.map[index].type !== 'ocean')
				index = getLowestElevationIndex(index, closed, true);
		}
	};
	
	this.runRivers = function(elevationPercent, riverCount)
	{
		//Sort the map indexes by elevation 
		this.sortIndexes('elevation');
		//Determine the index of the highest elevation
		var max = this.sortedIndexes.length-1;
		//Determine the index of the lowest elevation within our range percentage
		var min = max - Math.round(max*elevationPercent);
		//If a river count wasn't set determine one based on the size of the map
		if(riverCount == undefined)riverCount = Math.sqrt(this.size-1)*4;
		//This list of indexes already visited
		var closed = [];
		
		function waterPerimeter(index, name)
		{
			var waterCtr = 0;
			if(self.map[index].type !== 'edge')
			{
				if(self.map[index-1].name === name)waterCtr++;
				if(self.map[index+1].name === name)waterCtr++;
				if(self.map[index-self.size].name === name)waterCtr++;
				if(self.map[index+self.size].name === name)waterCtr++;
			}
			return waterCtr;
		}
		
		function river(index, name)
		{
			self.map[index].type = 'water';
			self.map[index].name = name;
			self.map[index].drainage = 0;
			
			if(waterPerimeter(index-1, name) > 1)closed.push(index-1);
			if(waterPerimeter(index+1, name) > 1)closed.push(index+1);
			if(waterPerimeter(index-self.size, name) > 1)closed.push(index-self.size);
			if(waterPerimeter(index+self.size, name) > 1)closed.push(index+self.size);
			
			var newindex = getLowestElevationIndex(index, closed, false);
			
			//if new index is less than zero maybe we should create a lake there.
			if(newindex < 0)return;
			else if(self.map[newindex].type === 'edge')return;
			else if(self.map[newindex].type === 'water')
			{
				//trace the water source that we found and 
				//try to find where it hits the ocean
				return;
			}
			else
			{
				//Average points around the index if they aren't the new index.
				if(index-1 != newindex)self.map[index-1].elevation = Math.round((self.map[index-1].elevation+self.map[index].elevation)/2);
				if(index+1 != newindex)self.map[index+1].elevation = Math.round((self.map[index+1].elevation+self.map[index].elevation)/2);
				if(index+self.size != newindex)self.map[index+self.size].elevation = Math.round((self.map[index+self.size].elevation+self.map[index].elevation)/2);
				if(index-self.size != newindex)self.map[index-self.size].elevation = Math.round((self.map[index-self.size].elevation+self.map[index].elevation)/2);
			}
			river(newindex, name);
		}
		
		for(var ctr=0; ctr < riverCount; ++ctr)
		{	
			var riverid = 'river'+ctr;
			var index = this.sortedIndexes[randomRange(min, max)];
			closed = [];
			//Generate a name
			river(index, riverid);
		}
	}
}

function World(size, oceanLevel)
{
	createAndFireEvent('beginWorldCreate');
	
	//... Create the terrain
	this.createTerrain = function()
	{
		this.terrain = new Terrain(new Drainage(size), oceanLevel);
		createAndFireEvent('landCreated');
	};
	
	//... Run some paths to simulate erotion
	this.createErosion = function(eleRange, pathCount)
	{
		this.terrain.runErosion(eleRange, pathCount);
		createAndFireEvent('erosionCreated');
	};
	
	//... Create river paths.
	this.createRivers = function(eleRange, pathCount)
	{
		this.terrain.runRivers(eleRange, pathCount); //Should rivers be run after rain fall is determined?
		createAndFireEvent('riversCreated');
	};
	
	//... Determine Rain fall
	//createAndFireEvent('weatherCreated');
	
	//... Determine temperatures
	this.createTemperatures = function()
	{
		this.temperature = new Temperature(this.terrain, oceanLevel);
		createAndFireEvent('temperaturesCreated');
	}
	
	//... Determine Biomes and name areas
	//createAndFireEvent('biomesCreated');
	
	function createAndFireEvent(eventName)
	{
		var evt = document.createEvent("Event");
		evt.initEvent(eventName,true,true);
		document.dispatchEvent(evt);
	}
	
	this.getSquare = function(x, y)
	{
		var index = x*size+y;
		return {
			type: this.terrain ? this.terrain.map[index].type : false,
			drainage: this.terrain ? this.terrain.map[index].drainage : false,
			elevation: this.terrain ? this.terrain.map[index].elevation : false,
			temperature: this.temperature ? this.temperature.map[index] : false
		}
	}
}