import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css']
})
export class RuletaComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef; // Para referenciar al elemento del html

  options: string[] = [];
  A = 10; //Luego estos dos valores van a entrar como parametro de los promedios de cada heroe
  B = 64;
  total = this.A + this.B;
  probabilityA = (this.A / this.total) * 100;
  probabilityB = (this.B / this.total) * 100; 
  //Se calculan las probabilidades que tiene cada uno en base a los valores de sus estadisticas

  //Variables para el funcionamiento de la ruleta
  startAngle = 0;
  optionsLength = 100;
  arc = Math.PI / (100 / 2);
  spinTimeout: any = null;
  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  ctx!: CanvasRenderingContext2D | null;

  constructor() { }

  //Se ingresan los valores en base a las probabilidades
  ngOnInit() {
    if (this.canvasRef) {
      for (let i = 0; i < 100; i++) {
        if (i < this.probabilityA) {
          this.options.push("A");
        } else {
          this.options.push("B");
        }
      }
    }
  }

  //Se renderiza la ruleta
  ngAfterViewInit() {
    this.drawRouletteWheel();
  }

  //Funcion para renderizar la ruleta en base al canva del html, además de printear las probabilidades
  drawRouletteWheel() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;

    this.ctx = canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 500, 500);

      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2;
      this.ctx.font = 'bold 12px Helvetica, Arial';

      for (let i = 0; i < this.optionsLength; i++) {
        const angle = this.startAngle + i * this.arc;
        this.ctx.fillStyle = this.getColor(this.options[i]);

        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.save();
        this.ctx.fillStyle = "red";
        this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius, 250 + Math.sin(angle + this.arc / 2) * textRadius);
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        const text = this.options[i];
        this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
        this.ctx.restore();
      }

      // Para la flecha
      this.ctx.fillStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250, 250 - (outsideRadius - 13));
      this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.fill();
    }
  }

  //Funcion llamada en el boton para girar la ruleta y variar los valores para su funcionamiento
  spin() {
    this.spinArcStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }

  //Chino
  rotateWheel() {
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    const spinAngle = this.spinArcStart - this.easeOut(this.spinTime, 0, this.spinArcStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI / 180);
    this.drawRouletteWheel();
    this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
  }

  //Chino y devuelve el valor qué ganó  
  stopRotateWheel() {
    if (this.ctx) {
      if (this.spinTimeout) {
        clearTimeout(this.spinTimeout as number);
      }
      const degrees = this.startAngle * 180 / Math.PI + 90;
      const arcd = this.arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      this.ctx.save();
      this.ctx.font = 'bold 30px Helvetica, Arial';
      const text = this.options[index];
      console.log(text);
      this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
      this.ctx.restore();
    }
  }


  easeOut(t: number, b: number, c: number, d: number): number {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  byte2Hex(n: number): string {
    const nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
  }

  RGB2Color(r: number, g: number, b: number): string {
    return `#${this.byte2Hex(r)}${this.byte2Hex(g)}${this.byte2Hex(b)}`;
  }

  getColor(item: string): string {
    if (item === 'A') {
      return this.RGB2Color(0, 0, 0);
    } else {
      return this.RGB2Color(255, 255, 255);
    }
  }
}
