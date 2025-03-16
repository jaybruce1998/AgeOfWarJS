const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let bullets=[];

class Bullet {
    constructor(x1, y1, x2, y2, damage, speed = 1) {
        this.x = x1;
        this.y = y1;
        this.targetX = x2;
        this.targetY = y2;
		this.damage=damage;
        this.speed = speed;

        // Calculate direction vector
        this.dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(this.dx * this.dx + dy * dy);

        this.vx = (length !== 0) ? (this.dx / length) * this.speed : 0;
        this.vy = (length !== 0) ? (dy / length) * this.speed : 0;
		this.hit=false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    }

	hitTroop()
	{
		for(let i=0; i<enemyTroops.length; i++)
			if(this.x>=enemyTroops[i].minX&&this.x<=enemyTroops[i].maxX&&this.y>=canvas.height-110&&this.y<=canvas.height-40)
				return i;
		return -1;
	}
	
	reward(j)
	{
		if(enemyTroops[j].hp<=0)
		{
			const r=enemyTroops.splice(j, 1)[0].reward;
			for(let i=j; i<enemyTroops.length; i++)
				enemyTroops[i].arrayPos=i;
			return r;
		}
		return 0;
	}
	
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Remove bullet if it reaches the target position
        if (this.dx>0)
		{
			if(this.y>canvas.height)
				this.hit=true;
			else if(this.vy==0&&this.x>1440)
			{
				base2hp-=this.damage;
				this.hit=true;
			}
			else if(enemyTroops.length>0)
			{
				const i=this.hitTroop();
				if(i>=0)
				{
					this.hit=true;
					enemyTroops[i].hp-=this.damage;
					const r=this.reward(i);
					if(r>0)
					{
						cash+=r;
						xp+=r+r;
						document.getElementById("cash").innerHTML=cash;
						document.getElementById("xp").innerHTML=xp;
					}
				}
			}
			else if(this.x>=this.targetX)
				this.hit=true;
		}
		else if(this.x<130)
		{
			base1hp-=this.damage;
			this.hit=true;
		}
		else if(playerTroops.length>0&&playerTroops[0].maxX<=this.x)
		{
			playerTroops[0].hp-=this.damage;
			xp+=Math.round(killCheck(playerTroops)/2);
			document.getElementById("xp").innerHTML=xp;
			this.hit=true;
		}
		else if(this.x<=this.targetX)
			this.hit=true;
    }
}