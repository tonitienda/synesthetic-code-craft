import {Rect, RectProps} from '@motion-canvas/2d';
import {createSignal} from '@motion-canvas/core';
import * as THREE from 'three';

/**
 * A deterministic Three.js viewport composited into Motion Canvas.
 * Three.js owns geometry and lighting; Motion Canvas owns every animated value.
 */
export class ThreeRocketNode extends Rect {
  public readonly yaw = createSignal(-18);
  public readonly pitch = createSignal(-2);
  public readonly thrust = createSignal(0);
  public readonly lightSweep = createSignal(0);

  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly rocket = new THREE.Group();
  private readonly keyLight: THREE.DirectionalLight;
  private readonly flame: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
  private readonly renderWidth = 620;
  private readonly renderHeight = 720;

  public constructor(props: RectProps = {}) {
    super({
      width: 620,
      height: 720,
      ...props,
    });

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.renderWidth;
    this.canvas.height = this.renderHeight;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.renderWidth, this.renderHeight, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(
      30,
      this.renderWidth / this.renderHeight,
      0.1,
      100,
    );
    this.camera.position.set(5.8, 0.05, 12.2);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.rocket);
    this.scene.add(new THREE.HemisphereLight(0xbbe8ff, 0x10121c, 1.45));
    this.keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
    this.keyLight.position.set(-4, 5, 7);
    this.scene.add(this.keyLight);
    const rim = new THREE.DirectionalLight(0x67e8f9, 3.8);
    rim.position.set(5, 1, -5);
    this.scene.add(rim);
    const lowerFill = new THREE.DirectionalLight(0x94a3b8, 3.2);
    lowerFill.position.set(-4, -4, 6);
    this.scene.add(lowerFill);
    const copperBounce = new THREE.PointLight(0xfb923c, 5.2, 8);
    copperBounce.position.set(-2.8, -2.1, 3.2);
    this.scene.add(copperBounce);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa8bac8,
      metalness: 0.58,
      roughness: 0.3,
      clearcoat: 0.34,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });
    const copperMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd17643,
      metalness: 0.7,
      roughness: 0.26,
      clearcoat: 0.2,
      side: THREE.DoubleSide,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.78,
      roughness: 0.32,
    });

    // One revolved profile creates the nose, shoulder, body, and lower taper.
    const profile = [
      new THREE.Vector2(0.43, -2.18),
      new THREE.Vector2(0.65, -1.82),
      new THREE.Vector2(0.76, -1.42),
      new THREE.Vector2(0.78, 1.12),
      new THREE.Vector2(0.73, 1.42),
      new THREE.Vector2(0.56, 1.78),
      new THREE.Vector2(0.3, 2.2),
      new THREE.Vector2(0.06, 2.58),
      new THREE.Vector2(0, 2.66),
    ];
    const body = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 72),
      bodyMaterial,
    );
    this.rocket.add(body);

    for (const y of [-1.42, 1.18]) {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(y < 0 ? 0.735 : 0.755, 0.035, 12, 72),
        copperMaterial,
      );
      band.rotation.x = Math.PI / 2;
      band.position.y = y;
      this.rocket.add(band);
    }

    const finShape = new THREE.Shape();
    finShape.moveTo(0.48, -1.76);
    finShape.bezierCurveTo(0.78, -1.72, 1.2, -1.92, 1.48, -2.24);
    finShape.lineTo(1.12, -0.78);
    finShape.bezierCurveTo(0.9, -0.65, 0.7, -0.62, 0.56, -0.68);
    finShape.closePath();
    const finGeometry = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 3,
    });
    finGeometry.translate(0, 0, -0.08);
    const rightFin = new THREE.Mesh(finGeometry, copperMaterial);
    const leftFin = new THREE.Mesh(finGeometry, copperMaterial);
    leftFin.scale.x = -1;
    this.rocket.add(rightFin, leftFin);

    const rearFin = new THREE.Mesh(finGeometry, copperMaterial);
    rearFin.rotation.y = Math.PI / 2;
    rearFin.scale.x = 0.82;
    this.rocket.add(rearFin);

    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.52, 0.62, 48, 1, true),
      darkMetal,
    );
    nozzle.position.y = -2.42;
    this.rocket.add(nozzle);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      emissive: 0x075985,
      emissiveIntensity: 0.7,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.38,
      thickness: 0.12,
      clearcoat: 1,
    });
    const porthole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.285, 0.285, 0.075, 40),
      glass,
    );
    porthole.rotation.x = Math.PI / 2;
    porthole.position.set(0, 0.46, 0.765);
    this.rocket.add(porthole);

    this.flame = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.035, 1.52, 40),
      new THREE.MeshBasicMaterial({
        color: 0xffb45d,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.flame.position.y = -3.46;
    this.flame.scale.set(0.01, 0.01, 0.01);
    this.rocket.add(this.flame);
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    this.rocket.rotation.y = THREE.MathUtils.degToRad(this.yaw());
    this.rocket.rotation.x = THREE.MathUtils.degToRad(this.pitch());
    const thrust = Math.max(0, this.thrust());
    this.flame.visible = thrust > 0.001;
    this.flame.scale.set(0.82 + thrust * 0.18, thrust, 0.82 + thrust * 0.18);
    this.keyLight.position.x = -4 + this.lightSweep() * 8;
    this.renderer.render(this.scene, this.camera);
    context.drawImage(
      this.canvas,
      -this.renderWidth / 2,
      -this.renderHeight / 2,
      this.renderWidth,
      this.renderHeight,
    );
    super.draw(context);
  }
}
