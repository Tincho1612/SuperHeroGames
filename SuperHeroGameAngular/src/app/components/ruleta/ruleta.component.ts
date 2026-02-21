import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Heroe } from 'src/app/interfaces/Heroe';
import { EstadisticasHeroeService } from 'src/app/services/estadisticas-heroe.service';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { Equipo } from 'src/app/interfaces/Equipo';
import { UsersService } from 'src/app/services/users.service';
import { ActiveNavbarService } from 'src/app/services/active-navbar.service';
import { forkJoin } from 'rxjs';

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

  //Variables de paginación en tabla de todos los heroes
  currentPage: number = 1;
  itemsPerPage: number = 10;

  //Search Bar
  searchHero: string = '';

  //Acciones de la tabla
  accionRuletaEquipo = 
  [{ label: 'Elegir', funcion: (heroe: Heroe) => this.seleccionarHeroe(heroe, true) },
  { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) }];
  accionRuletaLista = 
  [{ label: 'Elegir', funcion: (heroe: Heroe) => this.seleccionarHeroe(heroe, false) },
  { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) }];

  //Para la tabla izquierda
  equipos: Equipo[] = [{ nombre: '', heroes: [] }];
  currentPageForSecondTable: number = 1;
  itemsPerPageForSecondTable: number = 10;
  searchHeroForSecondTable: string = '';
  listHeroesForSecondTable: Heroe[] = [];

  //Variables para el modal
  modal = false;
  idHeroeActual = 0;

  constructor(
    private _serviceHeroe: SuperHeroApiService,
    private _serviceEstadisticas: EstadisticasHeroeService,
    private toastr: ToastrService,
    private _serviceUser: UsersService,
    private _navbar: ActiveNavbarService
  ) { }

  ngOnInit() {
    //Obtiene los datos de la api en base a los que están presentes en la base de datos
    //Un arreglo queda en memoria mientras esté en el componente ruleta para asegurar la cantidad correcta en el arreglo sin tener que hacer llamados constantes al servidor
    this._serviceUser.getActualUser().subscribe({
      next: (data) => {
        const idsEquipo: number[] = data.listaEquipo;

        const observables = idsEquipo.map(id => this._serviceHeroe.getHeroe(id));

        forkJoin(observables).subscribe({
          next: (heroesApi) => {
            this.equipos = [{ nombre: 'Ruleta', heroes: heroesApi }]
            this.getHeroesDefault(); //Obtiene los datos de la API de superheroes
            this.searchHeroBtnForSecondTable();
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (e) => {
        this.loading = false;
        const mensaje = typeof e.error === 'string' ? e.error : e.error?.message || 'Error';
        this.toastr.error(mensaje, 'Error');
      }
    });
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

    this._navbar.desactivarComponente(); //Para emitir un evento al servicio y desactivar la navbar

    this.isSpinning = true;
    this.spinArcStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }

  rotateWheel() {
    this.spinTime += 22;
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
    const text = this.elegirGanador(this.options[index]);
    this.ctx.fillText(text!, 250 - this.ctx.measureText(text!).width / 2, 250 + 10);
    this.ctx.restore();
    this.isSpinning = false;
    this._navbar.reactivarComponente();
  }

  elegirGanador(letra: string): string | undefined {
    if (letra == "A" && this.Heroe1 && this.Heroe2) {
      this.agregarHeroeGanado();
      return this.Heroe1.name;
    } else if (this.Heroe2 && this.Heroe1) {
      this.eliminarDelEquipo();
      return this.Heroe2.name;
    }
    return undefined;
  }

  crearPelea(id1: string, id2: string, id3: string, iL: boolean = false) {
    let body = {
      idHeroe1: +id1,
      idHeroe2: +id2,
      idGanador: +id3,
      isLast: iL //Se setea en true solamente en caso de que quede un solo heroe en el equipo, se utiliza unicamente en el servidor
    }

    this._serviceUser.agregarPelea(body).subscribe({
      next: () => {
        this.searchHeroBtnForSecondTable()
        this.getHeroesDefault();
      },
      error: (e) => {
        this.loading = false;
        const mensaje = typeof e.error === 'string' ? e.error : e.error?.message || 'Error';
        this.toastr.error(mensaje, 'Error');
      }
    })
  }

  agregarHeroeGanado() {
    this.toastr.success('El heroe con el que jugaste, ganó! Se agregó un nuevo heroe a tu equipo', 'Heroe agregado');
    if (this.Heroe1 && this.Heroe2) {
      this.crearPelea(this.Heroe1?.id, this.Heroe2?.id, this.Heroe1?.id);
    }
    this.equipos[0].heroes.push(this.Heroe2!);

    this.Heroe2 = undefined;
  }

  eliminarDelEquipo() {
    if (this.equipos[0].heroes.length == 1 && this.Heroe1 && this.Heroe2) {
      this.toastr.warning('Tu último heroé perdió, pero lo vas a conservar para seguir jugando!', 'Cuidado!');
      this.crearPelea(this.Heroe1?.id, this.Heroe2?.id, this.Heroe2?.id, true);
      this.Heroe1 = undefined;
      return;
    }
    const heroeId = this.Heroe1!.id;
    const heroeEncontrado = this.listHeroesForSecondTable.find((heroe) => heroe.id === heroeId);
    if (heroeEncontrado) {
      this.equipos[0].heroes.splice(this.equipos[0].heroes.indexOf(heroeEncontrado), 1);
      this.toastr.error('El heroe con el qué jugaste fué eliminado de tu lista de equipo!', 'Heroe eliminado');
    }
    if (this.Heroe1 && this.Heroe2) {
      this.crearPelea(this.Heroe1?.id, this.Heroe2?.id, this.Heroe2?.id);
    }
    this.Heroe1 = undefined;
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
        const equiposHeroes = this.equipos.reduce((heroes, equipo) => heroes.concat(equipo.heroes), [] as Heroe[]);
        this.allHeroes = data.results.filter((heroe: Heroe) => !equiposHeroes.some((equipoHeroe) => heroe.id === equipoHeroe.id));
        this.currentPage = 1;
        this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los héroes', 'Error');
        console.log(error);
        this.loading = false;
      }
    });
  }

  seleccionarHeroe(heroe: Heroe, fromEquipo: boolean) {
    if (this.isSpinning) {
      this.toastr.error('No podes elegir heroes durante el combate!', 'Error');
      return;
    }
    if (fromEquipo) {
      if (!this.Heroe1) {
        this.Heroe1 = heroe;
        this.estadisticasHeroe1 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe1);
        this.A = this.estadisticasHeroe1.promedio;
      } else {
        this.toastr.error('Elimina un héroe antes de elegir otro', 'Error');
      }
    } else {
      if (!this.Heroe2) {
        this.Heroe2 = heroe;
        this.estadisticasHeroe2 = this._serviceEstadisticas.getEstadisticasHeroe(this.Heroe2);
        this.B = this.estadisticasHeroe2.promedio;
      } else {
        this.toastr.error('Elimina un héroe antes de elegir otro', 'Error');
      }
    }
    this.agregarProbabilidades();
  }

  paginateHeroes(heroes: Heroe[], page: number, isForSecondTable: boolean = false): Heroe[] {
    const itemsPerPage = isForSecondTable ? this.itemsPerPageForSecondTable : this.itemsPerPage;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
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
            const equiposHeroes = this.equipos.reduce((heroes, equipo) => heroes.concat(equipo.heroes), [] as Heroe[]);
            this.allHeroes = data.results.filter((heroe: Heroe) => !equiposHeroes.some((equipoHeroe) => heroe.id === equipoHeroe.id));
            this.currentPage = 1;
            this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage, false); // Usar itemsPerPage para la primera tabla
            this.loading = false;
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

  //Paginacion para tabla de equipos

  // Función para la página anterior de la segunda tabla
  previousPageForSecondTable() {
    if (this.currentPageForSecondTable > 1) {
      this.currentPageForSecondTable--;
      this.listHeroesForSecondTable = this.paginateHeroes(this.equipos[0].heroes, this.currentPageForSecondTable, true);
    }
  }

  // Función para la página siguiente de la segunda tabla
  nextPageForSecondTable() {
    const totalHeroes = this.equipos[0].heroes.length;
    if (this.currentPageForSecondTable * this.itemsPerPageForSecondTable < totalHeroes) {
      this.currentPageForSecondTable++;
      this.listHeroesForSecondTable = this.paginateHeroes(this.equipos[0].heroes, this.currentPageForSecondTable, true);
    }
  }

  // Función para obtener los héroes de la segunda tabla basados en la página actual
  getHeroesForSecondTable(): Heroe[] {
    const startIndex = (this.currentPageForSecondTable - 1) * this.itemsPerPageForSecondTable;
    const endIndex = startIndex + this.itemsPerPageForSecondTable;
    return this.equipos[0].heroes.slice(startIndex, endIndex);
  }

  //Barra de busqueda para la tabla de equipos

  // Función para buscar héroes en la segunda tabla
  searchHeroesForSecondTable(searchTerm: string): Heroe[] {
    if (searchTerm === '') {
      return this.equipos[0].heroes;
    } else {
      return this.equipos[0].heroes.filter((heroe) => {
        // Aquí debes definir la lógica de búsqueda, por ejemplo, por nombre o palabra clave.
        return heroe.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }

  // Modificar la función searchHeroBtn para la segunda tabla
  searchHeroBtnForSecondTable() {
    const searchTerm = this.searchHeroForSecondTable;
    this.currentPageForSecondTable = 1; // Reiniciar la página al realizar una búsqueda

    const filteredHeroes = this.searchHeroesForSecondTable(searchTerm);
    if (filteredHeroes.length > 0) {
      this.listHeroesForSecondTable = this.paginateHeroes(filteredHeroes, this.currentPageForSecondTable, true); // Usar itemsPerPageForSecondTable
    } else {
      this.toastr.error('No se encontró ningún héroe con ese nombre o palabra clave', 'Error');
      this.searchHeroForSecondTable = ''; // Limpiar el campo de búsqueda
      this.getHeroesForSecondTable(); // Recuperar los héroes originales si no se encuentra ningún resultado
    }
  }

  eliminarCard(heroeKey: string) {
    if (heroeKey === 'Heroe1') {
      this.Heroe1 = undefined;
      this.A = 0;
    } else if (heroeKey === 'Heroe2') {
      this.Heroe2 = undefined;
      this.B = 0;
    }

    this.agregarProbabilidades();
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

}
