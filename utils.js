function randomRange(min, max)
{
	return Math.round(min+(Math.random()*(max-min)));
}

function arraySearch(val, array)
{
	var count = array.length;
	for(var i=0; i < count; ++i)
		if(array[i] == val)return i;
	return -1;
}

function clampValue(min, max, val)
{
	return Math.min(Math.max(val,min),max);
}