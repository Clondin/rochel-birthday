import bpy
import math
import os
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "blender", "renders-v2")
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 144
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.world = bpy.data.worlds.new("Warm afternoon studio")
scene.world.use_nodes = True
world_bg = scene.world.node_tree.nodes.get("Background")
world_bg.inputs["Color"].default_value = (0.76, 0.66, 0.53, 1)
world_bg.inputs["Strength"].default_value = 0.32


def material(name, color, roughness=0.82, fiber=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    if fiber:
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 125
        noise.inputs["Detail"].default_value = 2.5
        noise.inputs["Roughness"].default_value = 0.78
        noise.inputs["Distortion"].default_value = 0.12
        ramp = nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.28
        ramp.color_ramp.elements[0].color = (color[0] * 0.82, color[1] * 0.82, color[2] * 0.82, 1)
        ramp.color_ramp.elements[1].position = 0.72
        ramp.color_ramp.elements[1].color = (min(color[0] * 1.08, 1), min(color[1] * 1.08, 1), min(color[2] * 1.08, 1), 1)
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = fiber
        bump.inputs["Distance"].default_value = 0.018
        links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return m


ivory = material("Ivory cotton envelope", (0.89, 0.825, 0.72), 0.91, 0.22)
ivory_light = material("Quiet letter paper", (0.965, 0.925, 0.84), 0.93, 0.18)
ivory_edge = material("Visible paper edge", (0.64, 0.54, 0.42), 0.96, 0.06)
inner = material("Warm envelope interior", (0.61, 0.48, 0.36), 0.96, 0.14)
coral = material("Coral sealing wax", (0.91, 0.10, 0.035), 0.56, 0.13)
coral_imprint = material("Pressed C plus R", (0.54, 0.035, 0.018), 0.68)
seam_mat = material("Fold line", (0.39, 0.30, 0.24), 0.95)
surface_mat = material("Warm studio paper", (0.93, 0.885, 0.80), 0.96, 0.12)


def cube(name, location, scale, mat, bevel=0.06):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Hand softened edge", "BEVEL")
        mod.width = bevel
        mod.segments = 4
    obj.data.materials.append(mat)
    return obj


def paper_triangle(name, points, mat, thickness=0.07):
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(points, [], [(0, 1, 2)])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    solid = obj.modifiers.new("Believable paper thickness", "SOLIDIFY")
    solid.thickness = thickness
    bevel = obj.modifiers.new("Soft handmade edge", "BEVEL")
    bevel.width = 0.045
    bevel.segments = 3
    return obj


def curve_line(name, points, mat, width=0.012):
    curve = bpy.data.curves.new(name + " curve", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = width
    curve.bevel_resolution = 2
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, co in zip(spline.bezier_points, points):
        point.co = co
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def irregular_disc(name, location, radius, depth, mat):
    verts = []
    count = 72
    for z in (-depth / 2, depth / 2):
        for i in range(count):
            a = 2 * math.pi * i / count
            r = radius * (1 + 0.035 * math.sin(i * 5.0) + 0.02 * math.sin(i * 11.0 + 0.7))
            verts.append((r * math.cos(a), r * math.sin(a), z))
    faces = []
    faces.append(tuple(range(count - 1, -1, -1)))
    faces.append(tuple(range(count, count * 2)))
    for i in range(count):
        j = (i + 1) % count
        faces.append((i, j, count + j, count + i))
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Hand pressed rim", "BEVEL")
    bevel.width = 0.075
    bevel.segments = 4
    return obj


def key(obj, frame, **values):
    for prop, value in values.items():
        setattr(obj, prop, value)
        obj.keyframe_insert(data_path=prop, frame=frame)


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


# A large physical-paper sweep catches warm contact shadows all the way to frame edges.
surface = cube("Studio paper sweep", (0, 0, -0.22), (12, 10, 0.2), surface_mat, 0.16)

# The envelope is layered like real stationery, not a single flat card.
back = cube("Envelope back and pocket", (0, 0, 0.05), (3.28, 2.08, 0.095), ivory, 0.11)
edge = cube("Envelope cotton edge", (0, -0.02, 0.13), (3.20, 2.00, 0.035), ivory_edge, 0.08)
mouth = cube("Deep envelope mouth", (0, 0.86, 0.23), (3.02, 0.93, 0.045), inner, 0.055)
left_fold = paper_triangle("Left overlapping fold", [(-3.18,-1.91,0.49),(-3.18,1.75,0.49),(0.04,-0.18,0.53)], ivory, 0.085)
right_fold = paper_triangle("Right overlapping fold", [(3.18,-1.91,0.495),(3.18,1.75,0.495),(0.04,-0.18,0.54)], ivory, 0.085)
bottom_fold = paper_triangle("Bottom pocket fold", [(-3.15,-1.91,0.55),(3.15,-1.91,0.55),(0.04,0.20,0.56)], ivory_light, 0.09)

# Slightly imperfect fold lines are visible only when light catches them.
curve_line("Left fold impression", [(-3.02,-1.78,0.65),(0.04,-0.17,0.66)], seam_mat, 0.008)
curve_line("Right fold impression", [(3.02,-1.78,0.65),(0.04,-0.17,0.66)], seam_mat, 0.008)

# Letter has two layers, giving its deckled-looking edge a warm shadow during extraction.
letter_edge = cube("Letter edge layer", (0, 0.35, 0.355), (2.83, 1.72, 0.055), ivory_edge, 0.075)
letter = cube("Rochel letter surface", (0, 0.35, 0.43), (2.79, 1.68, 0.055), ivory_light, 0.072)

# The flap rotates around its actual top hinge.
flap = paper_triangle("Upper flap", [(-3.18,0,0),(3.18,0,0),(0,-3.34,0)], ivory_light, 0.095)
flap.location = (0, 1.94, 0.68)
flap.rotation_mode = "XYZ"

# An irregular wax puck and centered pressed monogram travel together.
seal = irregular_disc("Hand pressed coral wax seal", (0, 0.18, 0.82), 0.59, 0.18, coral)
bpy.ops.object.text_add(location=(0, 0.18, 0.93))
mark = bpy.context.object
mark.name = "C + R pressed monogram"
mark.data.body = "C + R"
mark.data.align_x = "CENTER"
mark.data.align_y = "CENTER"
mark.data.size = 0.30
mark.data.extrude = 0.008
mark.data.bevel_depth = 0.005
mark.data.materials.append(coral_imprint)
mark.rotation_mode = "XYZ"
seal.rotation_mode = "XYZ"
letter.rotation_mode = "XYZ"
letter_edge.rotation_mode = "XYZ"

# Animation beats: calm hold, wax peel, stiff flap, full readable extraction, then camera handoff.
key(flap, 1, rotation_euler=(0,0,0)); key(flap, 30, rotation_euler=(0,0,0))
key(flap, 49, rotation_euler=(math.radians(42),0,0)); key(flap, 68, rotation_euler=(math.radians(132),0,0))
key(flap, 144, rotation_euler=(math.radians(132),0,0))

for obj, start in ((seal,(0,0.18,0.82)), (mark,(0,0.18,0.93))):
    key(obj, 1, location=start, rotation_euler=(0,0,0), scale=(1,1,1))
    key(obj, 26, location=start, rotation_euler=(0,0,0), scale=(1,1,1))
key(seal, 43, location=(-0.70,-0.08,1.28), rotation_euler=(math.radians(18),math.radians(-13),math.radians(-16)), scale=(0.96,0.96,0.96))
key(mark, 43, location=(-0.70,-0.08,1.395), rotation_euler=(math.radians(18),math.radians(-13),math.radians(-16)), scale=(0.96,0.96,0.96))
key(seal, 66, location=(-3.48,-0.85,0.42), rotation_euler=(math.radians(7),math.radians(-4),math.radians(-28)), scale=(0.94,0.94,0.94))
key(mark, 66, location=(-3.48,-0.85,0.525), rotation_euler=(math.radians(7),math.radians(-4),math.radians(-28)), scale=(0.94,0.94,0.94))
key(seal, 144, location=(-3.48,-0.85,0.42), rotation_euler=(math.radians(7),math.radians(-4),math.radians(-28)), scale=(0.94,0.94,0.94))
key(mark, 144, location=(-3.48,-0.85,0.525), rotation_euler=(math.radians(7),math.radians(-4),math.radians(-28)), scale=(0.94,0.94,0.94))

for obj, z in ((letter,0.43),(letter_edge,0.355)):
    key(obj, 1, location=(0,0.35,z), rotation_euler=(0,0,0)); key(obj, 62, location=(0,0.35,z), rotation_euler=(0,0,0))
    key(obj, 74, location=(0,0.18,z+0.34), rotation_euler=(math.radians(-1.5),0,math.radians(-0.4)))
    key(obj, 94, location=(0,-2.52,z+0.36), rotation_euler=(0,0,math.radians(-1.3)))
    key(obj, 108, location=(0,-2.82,z+0.33), rotation_euler=(0,0,0))
    key(obj, 144, location=(0,-2.82,z+0.33), rotation_euler=(0,0,0))

# Animated focus target keeps depth of field restrained and intentional.
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0,0.18,0.82))
focus = bpy.context.object
focus.name = "Animated focus pull"
key(focus, 1, location=(0,0.18,0.82)); key(focus, 46, location=(-0.7,-0.08,0.85))
key(focus, 78, location=(0,-0.8,0.55)); key(focus, 144, location=(0,-2.82,0.60))

bpy.ops.object.camera_add(location=(0,-9.7,8.4))
camera = bpy.context.object
camera.name = "Warm invitation camera"
scene.camera = camera
camera.data.lens = 56
camera.data.dof.use_dof = True
camera.data.dof.focus_object = focus
camera.data.dof.aperture_fstop = 6.2
camera.rotation_mode = "XYZ"
camera_keys = [
    (1,(0,-9.7,8.4),56,(0,0,0.22)),
    (24,(0,-9.05,7.92),57,(0,0,0.25)),
    (52,(0,-8.72,7.72),58,(0,0,0.36)),
    (78,(0,-8.45,7.65),58,(0,-0.35,0.38)),
    (100,(0,-8.15,7.72),59,(0,-1.15,0.42)),
    (116,(0,-6.0,7.2),62,(0,-2.35,0.50)),
    (128,(0,-3.95,5.65),68,(0,-2.82,0.56)),
    (136,(0,-3.25,4.25),72,(0,-2.82,0.58)),
    (144,(0,-3.25,4.25),72,(0,-2.82,0.58)),
]
for frame, loc, lens, target in camera_keys:
    camera.location = loc
    camera.data.lens = lens
    look_at(camera, target)
    camera.keyframe_insert("location", frame=frame)
    camera.keyframe_insert("rotation_euler", frame=frame)
    camera.data.keyframe_insert("lens", frame=frame)

# Warm window key, cooler bounce, and a low rim make every paper layer legible.
bpy.ops.object.light_add(type="AREA", location=(-4.8,-4.4,8.8))
key_light = bpy.context.object
key_light.name = "Large afternoon window"
key_light.data.energy = 1120
key_light.data.shape = "RECTANGLE"
key_light.data.size = 5.8
key_light.data.size_y = 4.0
key_light.data.color = (1.0,0.69,0.47)
look_at(key_light, (0,0,0))
bpy.ops.object.light_add(type="AREA", location=(4.8,1.4,5.8))
fill_light = bpy.context.object
fill_light.name = "Soft sky bounce"
fill_light.data.energy = 310
fill_light.data.size = 4.5
fill_light.data.color = (0.72,0.82,1.0)
look_at(fill_light, (0,-0.5,0.2))
bpy.ops.object.light_add(type="AREA", location=(0,5.5,3.2))
rim_light = bpy.context.object
rim_light.name = "Paper edge rim"
rim_light.data.energy = 420
rim_light.data.size = 3.5
rim_light.data.color = (1.0,0.54,0.33)
look_at(rim_light, (0,0.5,0.4))

scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blender", "rochel-envelope-transition.blend"))
if "--render" in os.sys.argv:
    scene.render.filepath = os.path.join(OUT, "frame_")
    bpy.ops.render.render(animation=True)
