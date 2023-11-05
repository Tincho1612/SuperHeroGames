import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Heroe } from 'src/app/interfaces/Heroe';
import { EstadisticasHeroeService } from 'src/app/services/estadisticas-heroe.service';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { ListaHeroesComponent } from '../lista-heroes/lista-heroes.component';

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css']
})
export class RuletaComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  //Variables para la logica, probabilidades y vista
  allHeroes: Heroe[] = [];
  listHeroes: Heroe[] = [];
  Heroe1?: Heroe;
  estadisticasHeroe1: any;
  Heroe2?: Heroe;
  estadisticasHeroe2: any;
  options: string[] = [];
  A = 0;
  B = 0;

  //Variables para el funcionamiento y renderización de la ruleta
  startAngle = 0;
  optionsLength = 100;
  arc = Math.PI / (100 / 2);
  spinTimeout: any = null;
  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  ctx!: CanvasRenderingContext2D;

  isSpinning: boolean = false; //Para que el usuario no pueda girar la ruleta en caso de que esté girando

  loading: boolean = false; //Para el spinner, se usa cuando la lista está cargando

  //Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;

  //Search Bar
  searchHero: string = '';

  //Acciones de la tabla
  accionRuleta = [{ label: 'Elegir', funcion: (heroe: Heroe) => this.seleccionarHeroe(heroe) }];


  constructor(
    private _serviceHeroe: SuperHeroApiService,
    private _serviceEstadisticas: EstadisticasHeroeService,
    private toastr: ToastrService
  ) { }

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
    this.ctx.clearRect(0, 0, 500, 500);
  }

  drawWheelSections() { //Dibuja las secciones de la ruleta
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;

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

  drawArrow() { //Dibuja la flecha que elije el ganador
    const outsideRadius = 200;

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
    if (!this.Heroe1 || !this.Heroe2) {
      this.toastr.error('Selecciona dos héroes para girar la ruleta', 'Error');
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
    if (this.spinTimeout) {
      clearTimeout(this.spinTimeout);
    }
    const degrees = this.startAngle * 180 / Math.PI + 90;
    const arcd = this.arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    this.ctx.save();
    this.ctx.font = 'bold 30px Helvetica, Arial';
    const text = this.textoGanador(this.options[index]);
    this.ctx.fillText(text!, 250 - this.ctx.measureText(text!).width / 2, 250 + 10);
    this.ctx.restore();
    this.isSpinning = false;
  }

  textoGanador(letra: string): string | undefined {
    if (letra == "A") {
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
    return item === 'A' ? this.RGB2Color(153, 255, 153) : this.RGB2Color(255, 102, 102);
  }

  getHeroesDefault() {
    this.loading = true;
    this._serviceHeroe.getListHeroes().subscribe({
      next: (data) => {
        this.allHeroes = data.results;
        this.loading = false;
        this.currentPage = 1;
        this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
      },
      error: (error) => {
        this.toastr.error('Error al cargar los héroes', 'Error');
        this.loading = false;
      }
    });
  }

  seleccionarHeroe(heroe: Heroe) {
    if (!this.Heroe1) {
      if (heroe == this.Heroe2) {
        this.toastr.error('Elige un héroe distinto al otro para jugar', 'Error');
      } else {
        this.Heroe1 = heroe;
        this.estadisticasHeroe1 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe1);
        this.A = this.estadisticasHeroe1.promedio;
      }
    } else if (!this.Heroe2) {
      if (heroe == this.Heroe1) {
        this.toastr.error('Elige un héroe distinto al otro para jugar', 'Error');
      } else {
        this.Heroe2 = heroe;
        this.estadisticasHeroe2 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe2);
        this.B = this.estadisticasHeroe2.promedio;
      }
    } else {
      this.toastr.error('Elimina un héroe antes de elegir otro', 'Error');
    }

    this.agregarProbabilidades();
  }

  paginateHeroes(heroes: Heroe[], page: number): Heroe[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return heroes.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.allHeroes.length) {
      this.currentPage++;
      this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
    }
  }

  searchHeroBtn() {
    if (this.searchHero === '') {
      this.getHeroesDefault();
    } else {
      this.loading = true;
      this._serviceHeroe.getHeroesByWord(this.searchHero).subscribe({
        next: (data) => {
          if (data.results && data.results.length > 0) {
            this.allHeroes = data.results;
            this.loading = false;
            this.currentPage = 1;
            this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
          } else {
            this.toastr.error('No se encontró ningún héroe con ese nombre o palabra clave', 'Error');
            this.searchHero = '';
            this.getHeroesDefault();
          }
        },
        error: (error) => {
          this.toastr.error(error, 'Error');
          this.loading = false;
        }
      });
    }
  }

}
