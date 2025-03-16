let spawns=[0];
let ageStart=Date.now();
let lastESpawn=0;
let eTray=[];
let buyTimes=[25000, 100000, 150000, 25000, 100000, 150000, 25000, 100000, 150000, 125000, 175000, 125000, 300000, 500000];
let canTurret=true;
let buyDex=0;
let nextESpawn=0;

function buyEnemyTurret(slot, id)
{
	eTurrets[slot]=new Turret(id, 1450, turretHeights[slot], turretSpeeds[id], turretDamages[id], turretRanges[id]);
	document.getElementById("eTur"+slot).src="sprites/turrets/"+id+".png";
}

function sellEnemyTurret(slot)
{
	eTurrets[slot]=null;
	document.getElementById("eTur"+slot).src="";
}

function buyEnemySlot()
{
	document.getElementById("eSpot"+eTurrets.length).src="sprites/spot2/"+eLevel+".png";
	eTurrets.push(null);
}

function eUpdate()
{
	const f=Date.now()-ageStart;
	if(spawns.length==1&&f>37499)
		spawns.push(spawns[0]+1);
	else if(spawns.length==2&&f>124999)
		spawns.push(spawns[1]+1);
	else if(eLevel<4&&f>199999)
	{
		base2hp+=baseHealths[++eLevel]-base2maxHp;
		base2maxHp=baseHealths[eLevel];
		spawns=[eLevel*3];
		canTurret=true;
		document.getElementById("base2").src="sprites/bases/"+eLevel+".png";
		for(let i=1; i<eTurrets.length; i++)
			document.getElementById("eSpot"+i).src="sprites/spot2/"+eLevel+".png";
		ageStart=Date.now();
	}
	else if(canTurret&&f>=buyTimes[buyDex])
	{
		switch(buyDex)
		{
			case 0:
				buyEnemyTurret(0, 0);
				break;
			case 1:
				sellEnemyTurret(0);
				buyEnemyTurret(0, 1);
				break;
			case 2:
				canTurret=false;
				sellEnemyTurret(0);
				buyEnemyTurret(0, 2);
				break;
			case 3:
				sellEnemyTurret(0);
				buyEnemyTurret(0, 3);
				break;
			case 4:
				buyEnemySlot();
				sellEnemyTurret(0);
				buyEnemyTurret(0, 5);
				break;
			case 5:
				canTurret=false;
				buyEnemyTurret(1, 4);
				break;
			case 6:
				sellEnemyTurret(0);
				buyEnemyTurret(0, 6);
				break;
			case 7:
				buyEnemySlot();
				sellEnemyTurret(1);
				buyEnemyTurret(1, 6);
				break;
			case 8:
				canTurret=false;
				sellEnemyTurret(0);
				sellEnemyTurret(1);
				buyEnemyTurret(2, 8);
				break;
			case 9:
				buyEnemyTurret(0, 9);
				break;
			case 10:
				canTurret=false;
				sellEnemyTurret(0);
				sellEnemyTurret(2);
				buyEnemyTurret(2, 10);
				break;
			case 11:
				buyEnemyTurret(0, 12);
				break;
			case 12:
				for(let i=0; i<3; i++)
					sellEnemyTurret(i);
				buyEnemyTurret(1, 13);
				break;
			default:
				canTurret=false;
				buyEnemySlot();
				sellEnemyTurret(1);
				buyEnemyTurret(3, 14);
		}
		buyDex++;
	}
	if(eTray.length>0&&Date.now()>=nextESpawn)
	{
		spawnUnit(eTray.shift(), 1400, canvas.height-75, true);
		if(eTray.length>0)
			nextESpawn=Date.now()+troopTimes[eTray[0]];
	}
	if(Date.now()-lastESpawn>999)
	{
		if(eTray.length<5&&enemyTroops.length<6&&Math.random()<0.3)
		{
			const i=spawns[parseInt(Math.random()*spawns.length)];
			eTray.push(i);
			nextESpawn=Date.now()+troopTimes[i];
		}
		lastESpawn=Date.now();
	}
}