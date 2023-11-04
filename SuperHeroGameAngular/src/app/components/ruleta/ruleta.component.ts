import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Heroe } from 'src/app/interfaces/Heroe';
import { EstadisticasHeroeService } from 'src/app/services/estadisticas-heroe.service';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css']
})
export class RuletaComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef; //Referencia al canva del html

  //Variables para probabilidades/heroes/vista
  listHeroes: Heroe[] = [];
  Heroe1?: Heroe;
  estadisticasHeroe1: any;
  Heroe2?: Heroe;
  estadisticasHeroe2: any;
  options: string[] = [];
  A = 0;
  B = 0;

  //Para el funcionamiento de la ruleta
  startAngle = 0;
  optionsLength = 100;
  arc = Math.PI / (100 / 2);
  spinTimeout: any = null;
  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  ctx!: CanvasRenderingContext2D | null;

  isSpinning: boolean = false; //Para que el usuario no pueda girar la ruleta en caso de que esté girando

  loading: boolean = false; //Para el spinner, se usa cuando la lista está cargando

  constructor(
    private _serviceHeroe: SuperHeroApiService,
    private _serviceEstadisticas: EstadisticasHeroeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getHeroesDefault(); //Obtiene los datos de la api
  }

  ngAfterViewInit() {
    this.drawRouletteWheel();
  }

  drawRouletteWheel() {
    this.ctx = this.canvasRef.nativeElement.getContext("2d");
    this.clearCanvas();
    this.drawWheelSections();
    this.drawArrow();
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 500, 500);
    }
  }

  drawWheelSections() { //Dibuja las secciones de la ruleta
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;

    if (this.ctx) {
      this.ctx.strokeStyle = "grey";
      this.ctx.lineWidth = 1;
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
        this.ctx.translate(
          250 + Math.cos(angle + this.arc / 2) * textRadius,
          250 + Math.sin(angle + this.arc / 2) * textRadius
        );
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        const text = this.options[i];
        this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
        this.ctx.restore();
      }
    }
  }

  drawArrow() { //Dibuja la flecha que elije el ganador
    const outsideRadius = 200;

    if (this.ctx) {
      this.ctx.fillStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(250 - 4, 240 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 240 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 240 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 9, 240 - (outsideRadius - 5));
      this.ctx.lineTo(250, 240 - (outsideRadius - 13));
      this.ctx.lineTo(250 - 9, 240 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 240 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 240 - (outsideRadius + 5));
      this.ctx.fill();
    }
  }

  agregarProbabilidades() { //Calcula la probabilidad y dibuja la ruleta en base a eso / Se llama cada vez que se elije/borra un heroe
    this.clearCanvas();
    const total = this.A + this.B;
    this.options = this.calculateProbabilities(total);
    this.drawRouletteWheel();
  }

  calculateProbabilities(total: number): string[] { //Usada en la funcion agregarProbabilidades()
    const probabilities: string[] = [];

    for (let i = 0; i < 100; i++) {
      if (i < (this.A / total) * 100) {
        probabilities.push("A");
      } else {
        probabilities.push("B");
      }
    }

    return probabilities;
  }

  spin() { //Funcion usada en el click del html para girar la ruleta
    if (this.isSpinning || !this.Heroe1 || !this.Heroe2) {
      return;
    }

    this.isSpinning = true;
    this.spinArcStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }

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
      const text = this.textoGanador(this.options[index]);
      console.log(text);
      this.ctx.fillText(text!, 250 - this.ctx.measureText(text!).width / 2, 250 + 10);
      this.ctx.restore();
      this.isSpinning = false;
    }
  }

  textoGanador(letra: string){
    if(letra == "A"){
      return this.Heroe1?.name;
    } else {
      return this.Heroe2?.name;
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
    return item === 'A' ? this.RGB2Color(220, 220, 220) : this.RGB2Color(255, 255, 255);
  }

  getHeroesDefault() {
    this.loading = true;
    this._serviceHeroe.getListHeroes().subscribe((data) => {
      this.listHeroes = data.results;
      console.log(this.listHeroes);
      this.loading = false;
    });
  }

  seleccionarHeroe(Heroe: Heroe) {
    if (!this.Heroe1) {
      this.Heroe1 = Heroe;
      this.estadisticasHeroe1 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe1);
      this.A = this.estadisticasHeroe1.promedio;
    } else if (!this.Heroe2) {
      this.Heroe2 = Heroe;
      this.estadisticasHeroe2 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe2);
      this.B = this.estadisticasHeroe2.promedio;
    } else {
      this.toastr.error('Elimina un heroe antes de elegir otro', 'Error');
    }

    this.agregarProbabilidades();
  }
}
