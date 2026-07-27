import bpy
import math
import os
import random
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "blender", "fireworks-renders")
os.makedirs(OUT, exist_ok=True)

random.seed(702)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 126
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = True
scene.render.filepath = os.path.join(OUT, "fireworks-")
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = 0.35

scene.world = bpy.data.worlds.new("Transparent birthday sky")
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0, 0, 0, 0)
scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0


def emission(name, color, strength):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Emission Color"].default_value = (*color, 1)
    bsdf.inputs["Emission Strength"].default_value = strength
    bsdf.inputs["Roughness"].default_value = 0.24
    return mat


CORAL = emission("Rochel coral flare", (1.0, 0.035, 0.008), 8.0)
GOLD = emission("Champagne gold flare", (1.0, 0.26, 0.012), 9.0)
PALE_GOLD = emission("Warm pale gold", (1.0, 0.66, 0.26), 7.0)
IVORY = emission("White hot ignition", (1.0, 0.88, 0.63), 10.0)
ROSE = emission("Rose ember", (1.0, 0.025, 0.11), 7.0)


def set_linear_animation(owner):
    # Blender 5 uses slotted actions; the default Bezier interpolation already
    # gives these paths the organic acceleration and falloff we want.
    return


def curve_object(name, points, material, width, radii=None):
    data = bpy.data.curves.new(name + " curve", "CURVE")
    data.dimensions = "3D"
    data.resolution_u = 2
    data.bevel_depth = width
    data.bevel_resolution = 2
    data.bevel_factor_mapping_start = "SPLINE"
    data.bevel_factor_mapping_end = "SPLINE"
    spline = data.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for i, (point, co) in enumerate(zip(spline.points, points)):
        point.co = (*co, 1)
        point.radius = radii[i] if radii else 1
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def animate_traveling_trail(obj, start, travel, linger):
    data = obj.data
    data.bevel_factor_start = 0
    data.bevel_factor_end = 0
    data.keyframe_insert("bevel_factor_start", frame=start)
    data.keyframe_insert("bevel_factor_end", frame=start)

    data.bevel_factor_end = 1
    data.keyframe_insert("bevel_factor_end", frame=start + travel)
    data.bevel_factor_start = 0.03
    data.keyframe_insert("bevel_factor_start", frame=start + travel)

    data.bevel_factor_start = 0.58
    data.keyframe_insert("bevel_factor_start", frame=start + travel + linger)
    data.bevel_factor_end = 1
    data.keyframe_insert("bevel_factor_end", frame=start + travel + linger)

    data.bevel_factor_start = 1
    data.keyframe_insert("bevel_factor_start", frame=start + travel + linger + 12)
    set_linear_animation(data)


def sphere(name, location, radius, material):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj


def key_scale(obj, frame, value):
    obj.scale = (value, value, value)
    obj.keyframe_insert("scale", frame=frame)


def animate_head(name, points, start, travel, material, size):
    head = sphere(name, points[0], size, material)
    key_scale(head, start - 1, 0.001)
    key_scale(head, start, 1)
    steps = min(len(points), travel + 1)
    for i in range(steps):
        index = round(i * (len(points) - 1) / max(steps - 1, 1))
        head.location = points[index]
        head.keyframe_insert("location", frame=start + round(i * travel / max(steps - 1, 1)))
    key_scale(head, start + travel, 1.2)
    key_scale(head, start + travel + 3, 0.001)
    set_linear_animation(head)


def ballistic_points(center, angle, length, droop, curl, count=13):
    cx, cy, cz = center
    points = []
    for j in range(count):
        t = j / (count - 1)
        sideways = math.sin(t * math.pi) * curl
        points.append((
            cx + math.cos(angle) * length * t + math.cos(angle + math.pi / 2) * sideways,
            cy + math.sin(angle) * length * t - droop * t * t + math.sin(angle + math.pi / 2) * sideways,
            cz,
        ))
    return points


def falling_ember(name, start_point, angle, start, material, size):
    ember = sphere(name, start_point, size, material)
    key_scale(ember, start - 1, 0.001)
    key_scale(ember, start, 1)
    x, y, z = start_point
    for frame, t in ((start, 0), (start + 10, 0.45), (start + 22, 1.0)):
        ember.location = (
            x + math.cos(angle) * 0.26 * t,
            y + math.sin(angle) * 0.12 * t - 0.48 * t * t,
            z,
        )
        ember.keyframe_insert("location", frame=frame)
    key_scale(ember, start + 12, 0.65)
    key_scale(ember, start + 22, 0.001)
    set_linear_animation(ember)


def glitter_cloud(name, center, radius, start, materials, count):
    cx, cy, cz = center
    for i in range(count):
        angle = random.uniform(0, math.pi * 2)
        distance = radius * random.uniform(0.34, 1.02)
        target = (
            cx + math.cos(angle) * distance,
            cy + math.sin(angle) * distance - random.uniform(0.02, 0.22),
            cz,
        )
        material = materials[i % len(materials)]
        mote = sphere(f"{name} glitter mote {i:02d}", center, random.uniform(0.009, 0.018), material)
        delay = random.randint(4, 12)
        reveal = start + delay
        key_scale(mote, start - 1, 0.001)
        key_scale(mote, start + 1, random.uniform(0.35, 0.7))
        mote.location = target
        mote.keyframe_insert("location", frame=reveal)
        key_scale(mote, reveal, random.uniform(0.75, 1.25))

        # Uneven flashes, not a synchronized blink.
        key_scale(mote, reveal + random.randint(3, 6), 0.18)
        key_scale(mote, reveal + random.randint(7, 11), random.uniform(0.55, 0.95))
        key_scale(mote, reveal + random.randint(13, 17), 0.12)
        key_scale(mote, reveal + random.randint(18, 23), random.uniform(0.35, 0.7))
        end = reveal + random.randint(27, 35)
        mote.location = (target[0] + random.uniform(-0.10, 0.10), target[1] - random.uniform(0.28, 0.58), target[2])
        mote.keyframe_insert("location", frame=end)
        key_scale(mote, end, 0.001)
        set_linear_animation(mote)


def burst(name, center, radius, start, materials, rays=34, inner=False):
    phase = random.uniform(0, math.pi * 2)
    for i in range(rays):
        angle = phase + 2 * math.pi * i / rays + random.uniform(-0.035, 0.035)
        length = radius * random.uniform(0.78, 1.13)
        droop = random.uniform(0.14, 0.48) * (0.72 if inner else 1)
        curl = random.uniform(-0.07, 0.07)
        points = ballistic_points(center, angle, length, droop, curl)
        material = materials[i % len(materials)] if i % 5 == 0 else materials[0]
        radii = [0.42 + 0.58 * math.sin(math.pi * j / 12) for j in range(13)]
        radii[-1] = 0.22
        trail = curve_object(
            f"{name} tapered trail {i:02d}",
            points,
            material,
            random.uniform(0.009, 0.016) * (0.78 if inner else 1),
            radii,
        )
        travel = random.randint(9, 13)
        linger = random.randint(17, 25)
        delay = random.randint(0, 3)
        animate_traveling_trail(trail, start + delay, travel, linger)
        animate_head(f"{name} comet head {i:02d}", points, start + delay, travel, IVORY if i % 7 == 0 else material, 0.020)
        if i % 3 == 0:
            falling_ember(f"{name} drifting ember {i:02d}", points[-1], angle, start + delay + travel, material, 0.015)

    # Small white-hot core: a quick flash rather than a giant white disc.
    core = sphere(name + " ignition core", center, 0.055 if not inner else 0.038, IVORY)
    key_scale(core, start - 1, 0.001)
    key_scale(core, start + 1, 1.25)
    key_scale(core, start + 5, 0.001)
    glitter_cloud(name, center, radius, start, materials, max(12, rays // 2))


def rocket(name, x, start, burst_y, material, lean=0.0):
    points = []
    for j in range(12):
        t = j / 11
        points.append((x + lean * t + 0.035 * math.sin(t * math.pi * 3), -3.42 + (burst_y + 3.42) * t, 0))
    radii = [0.28 + 0.72 * math.sin(math.pi * j / 11) for j in range(12)]
    trail = curve_object(name + " rising comet trail", points, material, 0.018, radii)
    animate_traveling_trail(trail, start, 15, 2)
    animate_head(name + " rising comet head", points, start, 15, IVORY, 0.034)


# A designed performance: two asymmetric opening shells, a double center
# chrysanthemum, then lighter echo bursts that leave the page readable.
rocket("Opening left", -3.25, 1, 0.65, CORAL, 0.18)
burst("Coral willow", (-3.07, 0.65, 0), 1.48, 16, [CORAL, PALE_GOLD], 34)

rocket("Opening right", 2.92, 10, 1.20, GOLD, -0.14)
burst("Champagne peony", (2.78, 1.20, 0), 1.68, 25, [GOLD, PALE_GOLD], 38)

rocket("Center crown", -0.10, 27, 0.05, PALE_GOLD, 0.08)
burst("Center outer chrysanthemum", (-0.02, 0.05, 0), 2.03, 43, [PALE_GOLD, GOLD], 44)
burst("Center coral pistil", (-0.02, 0.05, 0), 1.05, 47, [CORAL, ROSE], 25, inner=True)

burst("High rose echo", (0.55, 2.20, 0), 0.88, 70, [ROSE, CORAL], 24, inner=True)
burst("Low gold echo", (3.72, -0.82, 0), 1.00, 84, [GOLD, PALE_GOLD], 27, inner=True)
burst("Final coral echo", (-3.88, -0.68, 0), 0.82, 94, [CORAL, PALE_GOLD], 22, inner=True)

bpy.ops.object.camera_add(location=(0, 0, 12))
camera = bpy.context.object
camera.name = "Full screen fireworks camera"
camera.data.type = "ORTHO"
camera.data.ortho_scale = 8.15
camera.rotation_euler = (Vector((0, 0, 0)) - camera.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = camera

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blender", "rochel-fireworks.blend"))
bpy.ops.render.render(animation=True)
