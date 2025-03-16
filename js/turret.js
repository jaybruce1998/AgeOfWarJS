class Turret {
    constructor(id, x, y, speed, damage, range) {
		this.id=id;
		this.x=x;
		this.y=y;
		this.speed=speed;
		this.damage=damage;
		this.range=range;
		this.troops=x==100?enemyTroops:playerTroops;
		this.attacking=false;
		this.nextAttack=0;
    }

	update()
	{
		if(this.troops.length==0)
			this.attacking=false;
		else if(this.attacking)
		{
			if(Date.now()>=this.nextAttack)
			{
				this.attacking=false;
				bullets.push(new Bullet(this.x, this.y, this.troops[0].xPos, this.troops[0].yPos+25, this.damage));
			}
		}
		else if(Math.sqrt(Math.pow(this.x-(this.x==100?this.troops[0].minX:this.troops[0].maxX), 2)+Math.pow(this.y-this.troops[0].yPos, 2))<=this.range)
		{
			this.attacking=true;
			this.nextAttack=Date.now()+this.speed;
		}
	}
}