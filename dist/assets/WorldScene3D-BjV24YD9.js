import{a as e,c as t,f as n,h as r,i,o as a,r as o,s,u as c}from"./index-CNK6swkf.js";import{A as l,B as u,D as d,F as f,G as p,I as m,O as h,P as ee,V as g,Z as _,a as te,d as ne,et as v,f as y,i as b,it as x,k as S,l as re,m as C,n as w,nt as T,o as E,q as D,r as ie,t as ae,tt as O,v as k,w as A}from"./Ocean3D-C1J85ZkL.js";import{n as j,t as oe}from"./SceneEffects-Cy1XrGHb.js";var M=r(n()),se=r(c()),N=new O,P=new O,F=new O,I=new v;function ce(e,t,n){let r=N.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,a=n.height/2;return[r.x*i+i,-(r.y*a)+a]}function le(e,t){let n=N.setFromMatrixPosition(e.matrixWorld),r=P.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),a=t.getWorldDirection(F);return i.angleTo(a)>Math.PI/2}function ue(e,t,n,r){let i=N.setFromMatrixPosition(e.matrixWorld),a=i.clone();a.project(t),I.set(a.x,a.y),n.setFromCamera(I,t);let o=n.intersectObjects(r,!0);if(o.length){let e=o[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}function de(e,t){if(t instanceof u)return t.zoom;if(t instanceof g){let n=N.setFromMatrixPosition(e.matrixWorld),r=P.setFromMatrixPosition(t.matrixWorld),i=t.fov*Math.PI/180,a=n.distanceTo(r);return 1/(2*Math.tan(i/2)*a)}else return 1}function fe(e,t,n){if(t instanceof g||t instanceof u){let r=N.setFromMatrixPosition(e.matrixWorld),i=P.setFromMatrixPosition(t.matrixWorld),a=r.distanceTo(i),o=(n[1]-n[0])/(t.far-t.near),s=n[1]-o*t.far;return Math.round(o*a+s)}}var pe=e=>Math.abs(e)<1e-10?0:e;function L(e,t,n=``){let r=`matrix3d(`;for(let n=0;n!==16;n++)r+=pe(t[n]*e.elements[n])+(n===15?`)`:`,`);return n+r}var me=(e=>t=>L(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),he=(e=>(t,n)=>L(t,e(n),`translate(-50%,-50%)`))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function ge(e){return e&&typeof e==`object`&&`current`in e}var R=M.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:a,fullscreen:o,portal:s,distanceFactor:c,sprite:l=!1,transform:u=!1,occlude:d,onOcclude:f,castShadow:p,receiveShadow:m,material:h,geometry:ee,zIndexRange:g=[16777271,0],calculatePosition:_=ce,as:v=`div`,wrapperClass:y,pointerEvents:b=`auto`,...x},S)=>{let{gl:C,camera:w,scene:T,size:E,raycaster:D,events:ie,viewport:ae}=ne(),[k]=M.useState(()=>document.createElement(v)),A=M.useRef(null),j=M.useRef(null),oe=M.useRef(0),N=M.useRef([0,0]),P=M.useRef(null),F=M.useRef(null),I=s?.current||ie.connected||C.domElement.parentNode,L=M.useRef(null),R=M.useRef(!1),z=M.useMemo(()=>d&&d!==`blending`||Array.isArray(d)&&d.length&&ge(d[0]),[d]);M.useLayoutEffect(()=>{let e=C.domElement;d&&d===`blending`?(e.style.zIndex=`${Math.floor(g[0]/2)}`,e.style.position=`absolute`,e.style.pointerEvents=`none`):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[d]),M.useLayoutEffect(()=>{if(j.current){let e=A.current=se.createRoot(k);if(T.updateMatrixWorld(),u)k.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;else{let e=_(j.current,w,E);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return I&&(i?I.prepend(k):I.appendChild(k)),()=>{I&&I.removeChild(k),e.unmount()}}},[I,u]),M.useLayoutEffect(()=>{y&&(k.className=y)},[y]);let B=M.useMemo(()=>u?{position:`absolute`,top:0,left:0,width:E.width,height:E.height,transformStyle:`preserve-3d`,pointerEvents:`none`}:{position:`absolute`,transform:a?`translate3d(-50%,-50%,0)`:`none`,...o&&{top:-E.height/2,left:-E.width/2,width:E.width,height:E.height},...n},[n,a,o,E,u]),V=M.useMemo(()=>({position:`absolute`,pointerEvents:b}),[b]);M.useLayoutEffect(()=>{if(R.current=!1,u){var t;(t=A.current)==null||t.render(M.createElement(`div`,{ref:P,style:B},M.createElement(`div`,{ref:F,style:V},M.createElement(`div`,{ref:S,className:r,style:n,children:e}))))}else{var i;(i=A.current)==null||i.render(M.createElement(`div`,{ref:S,style:B,className:r,children:e}))}});let H=M.useRef(!0);re(e=>{if(j.current){w.updateMatrixWorld(),j.current.updateWorldMatrix(!0,!1);let e=u?N.current:_(j.current,w,E);if(u||Math.abs(oe.current-w.zoom)>t||Math.abs(N.current[0]-e[0])>t||Math.abs(N.current[1]-e[1])>t){let t=le(j.current,w),n=!1;z&&(Array.isArray(d)?n=d.map(e=>e.current):d!==`blending`&&(n=[T]));let r=H.current;if(n){let e=ue(j.current,w,D,n);H.current=e&&!t}else H.current=!t;r!==H.current&&(f?f(!H.current):k.style.display=H.current?`block`:`none`);let i=Math.floor(g[0]/2),a=d?z?[g[0],i]:[i-1,0]:g;if(k.style.zIndex=`${fe(j.current,w,a)}`,u){let[e,t]=[E.width/2,E.height/2],n=w.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:a,bottom:o,right:s}=w,u=me(w.matrixWorldInverse),d=r?`scale(${n})translate(${pe(-(s+a)/2)}px,${pe((i+o)/2)}px)`:`translateZ(${n}px)`,f=j.current.matrixWorld;l&&(f=w.matrixWorldInverse.clone().transpose().copyPosition(f).scale(j.current.scale),f.elements[3]=f.elements[7]=f.elements[11]=0,f.elements[15]=1),k.style.width=E.width+`px`,k.style.height=E.height+`px`,k.style.perspective=r?``:`${n}px`,P.current&&F.current&&(P.current.style.transform=`${d}${u}translate(${e}px,${t}px)`,F.current.style.transform=he(f,1/((c||10)/400)))}else{let t=c===void 0?1:de(j.current,w)*c;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}N.current=e,oe.current=w.zoom}}if(!z&&L.current&&!R.current)if(u){if(P.current){let e=P.current.children[0];if(e!=null&&e.clientWidth&&e!=null&&e.clientHeight){let{isOrthographicCamera:t}=w;if(t||ee)x.scale&&(Array.isArray(x.scale)?x.scale instanceof O?L.current.scale.copy(x.scale.clone().divideScalar(1)):L.current.scale.set(1/x.scale[0],1/x.scale[1],1/x.scale[2]):L.current.scale.setScalar(1/x.scale));else{let t=(c||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;L.current.scale.set(n,r,1)}R.current=!0}}}else{let t=k.children[0];if(t!=null&&t.clientWidth&&t!=null&&t.clientHeight){let e=1/ae.factor,n=t.clientWidth*e,r=t.clientHeight*e;L.current.scale.set(n,r,1),R.current=!0}L.current.lookAt(e.camera.position)}});let U=M.useMemo(()=>({vertexShader:u?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[u]);return M.createElement(`group`,te({},x,{ref:j}),d&&!z&&M.createElement(`mesh`,{castShadow:p,receiveShadow:m,ref:L},ee||M.createElement(`planeGeometry`,null),h||M.createElement(`shaderMaterial`,{side:2,vertexShader:U.vertexShader,fragmentShader:U.fragmentShader})))}),z=b>=125?`uv1`:`uv2`,B=new C,V=new O,H=class extends d{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new A([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new A([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new h(t,6,1);return this.setAttribute(`instanceStart`,new S(n,3,0)),this.setAttribute(`instanceEnd`,new S(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new h(n,t*2,1);return this.setAttribute(`instanceColorStart`,new S(r,t,0)),this.setAttribute(`instanceColorEnd`,new S(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new x(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new C);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),B.setFromBufferAttribute(t),this.boundingBox.union(B))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new D),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)V.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(V)),V.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(V));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},U=class extends H{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},_e=class extends p{constructor(e){super({type:`LineMaterial`,uniforms:_.clone(_.merge([y.common,y.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new v(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${b>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},ve=new T,ye=new O,be=new O,W=new T,G=new T,K=new T,xe=new O,Se=new f,q=new l,Ce=new O,J=new C,Y=new D,X=new T,Z,Q;function we(e,t,n){return X.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),X.multiplyScalar(1/X.w),X.x=Q/n.width,X.y=Q/n.height,X.applyMatrix4(e.projectionMatrixInverse),X.multiplyScalar(1/X.w),Math.abs(Math.max(X.x,X.y))}function Te(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){q.start.fromBufferAttribute(i,r),q.end.fromBufferAttribute(a,r),q.applyMatrix4(n);let o=new O,s=new O;Z.distanceSqToSegment(q.start,q.end,s,o),s.distanceTo(o)<Q*.5&&t.push({point:s,pointOnLine:o,distance:Z.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[z]:null})}}function Ee(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;Z.at(1,K),K.w=1,K.applyMatrix4(t.matrixWorldInverse),K.applyMatrix4(r),K.multiplyScalar(1/K.w),K.x*=i.x/2,K.y*=i.y/2,K.z=0,xe.copy(K),Se.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(W.fromBufferAttribute(s,t),G.fromBufferAttribute(c,t),W.w=1,G.w=1,W.applyMatrix4(Se),G.applyMatrix4(Se),W.z>u&&G.z>u)continue;if(W.z>u){let e=W.z-G.z,t=(W.z-u)/e;W.lerp(G,t)}else if(G.z>u){let e=G.z-W.z,t=(G.z-u)/e;G.lerp(W,t)}W.applyMatrix4(r),G.applyMatrix4(r),W.multiplyScalar(1/W.w),G.multiplyScalar(1/G.w),W.x*=i.x/2,W.y*=i.y/2,G.x*=i.x/2,G.y*=i.y/2,q.start.copy(W),q.start.z=0,q.end.copy(G),q.end.z=0;let o=q.closestPointToPointParameter(xe,!0);q.at(o,Ce);let l=ee.lerp(W.z,G.z,o),d=l>=-1&&l<=1,f=xe.distanceTo(Ce)<Q*.5;if(d&&f){q.start.fromBufferAttribute(s,t),q.end.fromBufferAttribute(c,t),q.start.applyMatrix4(a),q.end.applyMatrix4(a);let r=new O,i=new O;Z.distanceSqToSegment(q.start,q.end,i,r),n.push({point:i,pointOnLine:r,distance:Z.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[z]:null})}}}var De=class extends m{constructor(e=new H,t=new _e({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)ye.fromBufferAttribute(t,e),be.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+ye.distanceTo(be);let i=new h(r,2,1);return e.setAttribute(`instanceDistanceStart`,new S(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new S(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;Z=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;Q=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),Y.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?Q*.5:we(r,Math.max(r.near,Y.distanceToPoint(Z.origin)),s.resolution),Y.radius+=c,Z.intersectsSphere(Y)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),J.copy(o.boundingBox).applyMatrix4(a);let l;l=n?Q*.5:we(r,Math.max(r.near,J.distanceToPoint(Z.origin)),s.resolution),J.expandByScalar(l),Z.intersectsBox(J)!==!1&&(n?Te(this,t):Ee(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(ve),this.material.uniforms.resolution.value.set(ve.z,ve.w))}},Oe=class extends De{constructor(e=new U,t=new _e({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},ke=M.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...s},c){var l;let u=ne(e=>e.size),d=M.useMemo(()=>a?new De:new Oe,[a]),[f]=M.useState(()=>new _e),p=(n==null||(l=n[0])==null?void 0:l.length)===4?4:3,m=M.useMemo(()=>{let r=a?new H:new U,i=e.map(e=>{let t=Array.isArray(e);return e instanceof O||e instanceof T?[e.x,e.y,e.z]:e instanceof v?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof k?e.toArray():e);r.setColors(e.flat(),p)}return r},[e,a,n,p]);return M.useLayoutEffect(()=>{d.computeLineDistances()},[e,d]),M.useLayoutEffect(()=>{o?f.defines.USE_DASH=``:delete f.defines.USE_DASH,f.needsUpdate=!0},[o,f]),M.useEffect(()=>()=>{m.dispose(),f.dispose()},[m]),M.createElement(`primitive`,te({object:d,ref:c},s),M.createElement(`primitive`,{object:m,attach:`geometry`}),M.createElement(`primitive`,te({object:f,attach:`material`,color:t,vertexColors:!!n,resolution:[u.width,u.height],linewidth:r??i??1,dashed:o,transparent:p===4},s)))}),$=a();function Ae({island:t,unlocked:n,solved:r,onClick:a,isFinal:c=!1}){let{t:l}=s(),{x:u,z:d}=w(t.position.x,t.position.y),f=c?`#7a5a2a`:`#3a6b3f`,p=c?`#a3792f`:`#4d8a52`,m=c?1.15:1;return(0,$.jsxs)(`group`,{position:[u,0,d],children:[(0,$.jsxs)(`mesh`,{position:[0,-.05,0],scale:m,castShadow:!0,receiveShadow:!0,children:[(0,$.jsx)(`cylinderGeometry`,{args:[1.1,1.4,.3,12]}),(0,$.jsx)(`meshStandardMaterial`,{color:f,roughness:.9})]}),(0,$.jsxs)(`mesh`,{position:[0,.35,0],scale:m,castShadow:!0,children:[(0,$.jsx)(`coneGeometry`,{args:[.75,.9,12]}),(0,$.jsx)(`meshStandardMaterial`,{color:p,roughness:.85})]}),(0,$.jsx)(R,{center:!0,distanceFactor:14,position:[0,1.6*m,0],children:(0,$.jsxs)(`button`,{type:`button`,disabled:!n,onClick:a,className:`flex flex-col items-center gap-1 disabled:cursor-not-allowed`,children:[t.level?(0,$.jsxs)(`span`,{className:`rounded-full px-2 py-0.5 text-[10px] font-display tracking-wide ${n?`bg-gold-400 text-ink-900`:`bg-parchment-100/20 text-parchment-100/50`}`,children:[l(o.levelLabel),` `,t.level]}):null,(0,$.jsxs)(`div`,{className:`relative flex h-6 w-6 items-center justify-center`,children:[n&&!r?(0,$.jsx)(`span`,{className:`absolute -inset-2 animate-ping rounded-full bg-gold-400/25`}):null,n?null:(0,$.jsx)(i,{size:16,className:`text-parchment-200/70`}),r?(0,$.jsx)(e,{size:16,className:`text-gold-400`}):null]}),(0,$.jsx)(`span`,{className:`font-display text-xs tracking-wide whitespace-nowrap ${n?`text-parchment-100`:`text-parchment-100/40`}`,children:l(t.name)})]})})]})}function je(e){let{x:t,z:n}=w(e.x,e.y);return[t,.02,n]}function Me({islands:e,finalIsland:t,finalUnlocked:n}){let r=[...e].sort((e,t)=>e.order-t.order),i=r.map(e=>je(e.position)),a=r[r.length-1];return(0,$.jsxs)($.Fragment,{children:[i.length>1?(0,$.jsx)(ke,{points:i,color:`#f2e6c4`,transparent:!0,opacity:.25,lineWidth:1,dashed:!0,dashSize:.3,gapSize:.25}):null,n&&a?(0,$.jsx)(ke,{points:[je(a.position),je(t.position)],color:`#e8c368`,transparent:!0,opacity:.7,lineWidth:1.4,dashed:!0,dashSize:.3,gapSize:.25}):null]})}var Ne=52,Pe=1.3;function Fe({bounds:e}){let{camera:t,size:n}=ne();return(0,M.useEffect)(()=>{if(!(t instanceof g)||n.height===0)return;let r=(e.minX+e.maxX)/2,i=(e.minZ+e.maxZ)/2,a=(e.maxX-e.minX)/2,o=(e.maxZ-e.minZ)/2,s=t.fov*Math.PI/180,c=n.width/n.height,l=2*Math.atan(Math.tan(s/2)*c),u=o/Math.sin(s/2),d=a/Math.sin(l/2),f=Math.max(u,d)*Pe,p=Ne*Math.PI/180;t.position.set(r,f*Math.sin(p),i+f*Math.cos(p)),t.lookAt(r,0,i),t.updateProjectionMatrix()},[t,n.width,n.height,e.minX,e.maxX,e.minZ,e.maxZ]),null}function Ie({islands:e,finalIsland:n,finalUnlocked:r,isUnlocked:i,isSolved:a,onSelectIsland:o,shipPosition:s,shipBearing:c}){let l=(0,M.useMemo)(()=>{let r=[...e.map(e=>e.position),n.position,t].map(({x:e,y:t})=>w(e,t));return{minX:Math.min(...r.map(e=>e.x)),maxX:Math.max(...r.map(e=>e.x)),minZ:Math.min(...r.map(e=>e.z)),maxZ:Math.max(...r.map(e=>e.z))}},[]);return(0,$.jsxs)(E,{shadows:!0,dpr:[1,1.5],gl:{antialias:!0},children:[(0,$.jsx)(ie,{makeDefault:!0,fov:42,near:.1,far:200}),(0,$.jsx)(Fe,{bounds:l}),(0,$.jsx)(`color`,{attach:`background`,args:[`#bfe0ee`]}),(0,$.jsx)(`fog`,{attach:`fog`,args:[`#bfe0ee`,26,65]}),(0,$.jsx)(`ambientLight`,{intensity:.75,color:`#fff8ec`}),(0,$.jsx)(`directionalLight`,{position:[8,16,6],intensity:1.2,color:`#fff4d9`,castShadow:!0}),(0,$.jsxs)(M.Suspense,{fallback:null,children:[(0,$.jsx)(ae,{}),(0,$.jsx)(Me,{islands:e,finalIsland:n,finalUnlocked:r}),e.map(e=>(0,$.jsx)(Ae,{island:e,unlocked:i(e),solved:a(e),onClick:()=>o(e)},e.id)),r?(0,$.jsx)(Ae,{island:n,unlocked:!0,solved:!1,isFinal:!0,onClick:()=>o(n)}):null,(0,$.jsx)(j,{position:s,bearing:c})]}),(0,$.jsx)(oe,{})]})}export{Ie as WorldScene3D};