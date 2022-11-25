import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from '../../../services/guest.service';

declare var tns: any;
declare var lightGallery: any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  public slug: any;
  public producto: any = {};
  public url: any;
  public productos_rec: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService
  ) {

    this.url = GLOBAL.url;

    this._route.params.subscribe(
      params => {
        this.slug = params['slug'];

        this._guestService.obtener_producto_slug(this.slug).subscribe(
          response => {
            this.producto = response.data;

            //Obtener productos recomendados
            this._guestService.listar_productos_recomendados(this.producto.categoria).subscribe(
              response => {
                this.productos_rec = response.data;
              }
            );
          }
        );
      }
    );
  }

  ngOnInit(): void {

    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#cs-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll(".cs-gallery");
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], { selector: ".cs-gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });
    }, 500)

    tns({
      container: '.cs-carousel-inner',
      controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: "#cs-thumbnails",
      navAsThumbnails: true,
      gutter: 15,
    });
  }

}