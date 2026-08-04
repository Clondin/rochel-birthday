import bpy
import math
import os
import random
import sys
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "blender", "envelope-cinematic-renders")
MOBILE_OUT = os.path.join(ROOT, "blender", "envelope-cinematic-mobile-renders")
PREVIEW = os.path.join(ROOT, "blender", "envelope-cinematic-preview")
os.makedirs(OUT, exist_ok=True)
os.makedirs(MOBILE_OUT, exist_ok=True)
os.makedirs(PREVIEW, exist_ok=True)
random.seed(70202)
MOBILE_MODE = "--render-mobile" in sys.argv or "--render-letter-mobile" in sys.argv or "--preview-mobile" in sys.argv

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100
scene.render.fps = 24
scene.frame_start = 1
scene.frame_end = 192
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = 0.15
scene.world = bpy.data.worlds.new("Warm quiet studio")
scene.world.use_nodes = True
world = scene.world.node_tree.nodes.get("Background")
world.inputs["Color"].default_value = (0.16, 0.105, 0.075, 1)
world.inputs["Strength"].default_value = 0.18


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def key(obj, frame, **values):
    for prop, value in values.items():
        setattr(obj, prop, value)
        obj.keyframe_insert(data_path=prop, frame=frame)


def principled(name, color, roughness=0.7, noise_scale=None, bump=0.0, subsurface=0.0, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
    if noise_scale:
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = noise_scale
        noise.inputs["Detail"].default_value = 4.5
        noise.inputs["Roughness"].default_value = 0.72
        ramp = nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.30
        ramp.color_ramp.elements[0].color = (color[0] * 0.73, color[1] * 0.73, color[2] * 0.73, 1)
        ramp.color_ramp.elements[1].position = 0.72
        ramp.color_ramp.elements[1].color = (min(color[0] * 1.13, 1), min(color[1] * 1.13, 1), min(color[2] * 1.13, 1), 1)
        links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
        if bump:
            bump_node = nodes.new("ShaderNodeBump")
            bump_node.inputs["Strength"].default_value = bump
            bump_node.inputs["Distance"].default_value = 0.025
            links.new(noise.outputs["Fac"], bump_node.inputs["Height"])
            links.new(bump_node.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


PAPER = principled("Cotton rag envelope paper", (0.91, 0.835, 0.72), 0.9, 145, 0.24)
PAPER_LIGHT = principled("Letter paper in warm ivory", (0.975, 0.925, 0.82), 0.92, 180, 0.17)
PAPER_EDGE = principled("Deckled warm paper edge", (0.58, 0.43, 0.31), 0.96, 90, 0.12)
POCKET = principled("Envelope pocket shadow", (0.33, 0.20, 0.14), 0.95, 55, 0.15)
WAX = principled("Coral sealing wax", (0.93, 0.055, 0.014), 0.43, 11, 0.28, 0.07)
WAX_DARK = principled("Pressed wax shadow", (0.38, 0.012, 0.004), 0.55, 16, 0.14)
INK = principled("Warm black ink", (0.055, 0.028, 0.022), 0.78)
CORAL_INK = principled("Coral letterpress ink", (0.85, 0.055, 0.018), 0.67)
GOLD = principled("Quiet gold foil", (0.76, 0.32, 0.06), 0.31, metallic=0.72)
SURFACE = principled("Warm plaster writing table", (0.64, 0.47, 0.33), 0.88, 6.5, 0.35)
PHOTO_WHITE = principled("Photo border", (0.965, 0.91, 0.81), 0.82, 95, 0.10)
RIBBON = principled("Coral silk ribbon", (0.69, 0.035, 0.017), 0.34, 8, 0.12)
PEN_DARK = principled("Fountain pen lacquer", (0.035, 0.022, 0.019), 0.24, metallic=0.28)
PEN_GOLD = principled("Fountain pen gold", (0.72, 0.31, 0.055), 0.23, metallic=0.86)
DUST = principled("Dust in the window light", (1.0, 0.58, 0.24), 0.45)


def cube(name, location, scale, material, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Soft handmade edge", "BEVEL")
        mod.width = bevel
        mod.segments = 4
    obj.data.materials.append(material)
    return obj


def triangle(name, points, material, thickness=0.055, bevel=0.032):
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(points, [], [(0, 1, 2)])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    solid = obj.modifiers.new("Cotton paper thickness", "SOLIDIFY")
    solid.thickness = thickness
    soft = obj.modifiers.new("Deckled softened edge", "BEVEL")
    soft.width = bevel
    soft.segments = 3
    return obj


def curve(name, points, material, width=0.018):
    data = bpy.data.curves.new(name + " curve", "CURVE")
    data.dimensions = "3D"
    data.bevel_depth = width
    data.bevel_resolution = 3
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, co in zip(spline.bezier_points, points):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def text_obj(name, text, location, size, material, align="CENTER", extrude=0.006, font=None, bevel=None):
    bpy.ops.object.text_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = align
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = bevel if bevel is not None else max(0.0005, extrude * 0.25)
    if font is not None:
        obj.data.font = font
    obj.data.materials.append(material)
    return obj


def image_material(name, path):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    image = nodes.new("ShaderNodeTexImage")
    image.image = bpy.data.images.load(path, check_existing=True)
    image.interpolation = "Linear"
    links.new(image.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.58
    return mat


def photo_print(name, image_path, location, size, rotation=0):
    card = cube(name + " cotton border", location, (size[0] * 0.56, size[1] * 0.60, 0.035), PHOTO_WHITE, 0.035)
    card.rotation_euler[2] = rotation
    bpy.ops.mesh.primitive_plane_add(size=2, location=(location[0], location[1] - size[1] * 0.035, location[2] + 0.038))
    image = bpy.context.object
    image.name = name + " photograph"
    image.scale = (size[0] * 0.50, size[1] * 0.49, 1)
    image.rotation_euler[2] = rotation
    image.data.materials.append(image_material(name + " image", image_path))
    return card, image


def wax_sector(name, center, radius, start_angle, end_angle, material):
    cx, cy, cz = center
    steps = 15
    verts = [(cx, cy, cz)]
    for i in range(steps + 1):
        a = start_angle + (end_angle - start_angle) * i / steps
        irregular = radius * (1 + 0.035 * math.sin(i * 4.7 + start_angle * 3))
        verts.append((cx + irregular * math.cos(a), cy + irregular * math.sin(a), cz))
    faces = [tuple(range(len(verts)))]
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    solid = obj.modifiers.new("Thick snapped wax", "SOLIDIFY")
    solid.thickness = 0.16
    bevel = obj.modifiers.new("Melted wax rim", "BEVEL")
    bevel.width = 0.045
    bevel.segments = 4
    return obj


GEORGIA = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Georgia.ttf", check_existing=True)
GEORGIA_ITALIC = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Georgia Italic.ttf", check_existing=True)
CHANCERY = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Apple Chancery.ttf", check_existing=True)


# ----- Set dressing: an intimate writing table rather than an empty render -----
table = cube("Full frame warm plaster table", (0, 0.5, -0.38), (11.5, 8.2, 0.32), SURFACE, 0.16)

# A loose coral ribbon enters and leaves frame, leading the eye toward the seal.
ribbon = curve("Loose birthday ribbon", [(-7.2, 2.9, 0.03), (-5.0, 2.4, 0.08), (-4.4, 0.8, 0.05), (-5.3, -1.2, 0.06)], RIBBON, 0.105)
ribbon.data.bevel_resolution = 5

# Meaningful photo prints sit just outside the main action.
photo_print("Wedding memory print", os.path.join(ROOT, "public", "photos", "optimized", "p11-letter.webp"), (-4.85, 2.32, 0.02), (2.2, 2.2), math.radians(-9))
photo_print("Rochel portrait print", os.path.join(ROOT, "public", "photos", "optimized", "p44-hero.webp"), (4.75, 2.15, 0.015), (1.9, 2.25), math.radians(7))

# Fountain pen on the lower right.
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.14, depth=3.55, location=(4.65, -2.20, 0.02), rotation=(0, math.radians(90), math.radians(-16)))
pen = bpy.context.object
pen.name = "Black lacquer fountain pen"
pen.data.materials.append(PEN_DARK)
bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.15, radius2=0.025, depth=0.78, location=(3.02, -1.72, 0.02), rotation=(0, math.radians(90), math.radians(-16)))
nib = bpy.context.object
nib.name = "Gold fountain pen nib"
nib.data.materials.append(PEN_GOLD)

# A minimal dried sprig provides organic shadow movement in the top right.
stem = curve("Dried birthday sprig stem", [(5.8, 3.8, 0.06), (5.1, 3.0, 0.10), (4.7, 1.9, 0.10)], GOLD, 0.028)
for i, (x, y) in enumerate(((5.45,3.28),(5.18,2.96),(4.98,2.63),(4.83,2.30))):
    curve(f"Sprig leaf left {i}", [(x,y,0.10),(x-0.42,y+0.22,0.11)], GOLD, 0.020)
    curve(f"Sprig leaf right {i}", [(x,y,0.10),(x+0.34,y+0.30,0.11)], GOLD, 0.020)

# ----- The envelope: built in paper layers with a real pocket and hinge -----
envelope_root = bpy.data.objects.new("Envelope hero root", None)
bpy.context.collection.objects.link(envelope_root)
envelope_root.rotation_euler[2] = math.radians(-1.2)

back = cube("Envelope cotton back", (0, 0, 0.10), (3.48, 2.17, 0.085), PAPER, 0.10)
edge = cube("Visible deckled envelope edge", (0, -0.02, 0.19), (3.37, 2.06, 0.038), PAPER_EDGE, 0.075)
mouth = cube("Deep envelope pocket", (0, 0.94, 0.28), (3.18, 0.94, 0.035), POCKET, 0.055)
left_fold = triangle("Envelope left overlapping fold", [(-3.32,-1.93,0.51),(-3.32,1.83,0.51),(0.03,-0.20,0.57)], PAPER, 0.075)
right_fold = triangle("Envelope right overlapping fold", [(3.32,-1.93,0.515),(3.32,1.83,0.515),(0.03,-0.20,0.575)], PAPER, 0.075)
bottom_fold = triangle("Envelope lower pocket fold", [(-3.30,-1.94,0.58),(3.30,-1.94,0.58),(0.03,0.24,0.62)], PAPER_LIGHT, 0.08)
curve("Left pressed fold line", [(-3.10,-1.78,0.67),(-1.45,-0.88,0.68),(0.03,-0.18,0.69)], PAPER_EDGE, 0.008)
curve("Right pressed fold line", [(3.10,-1.78,0.67),(1.48,-0.89,0.68),(0.03,-0.18,0.69)], PAPER_EDGE, 0.008)
for obj in (back, edge, mouth, left_fold, right_fold, bottom_fold):
    obj.parent = envelope_root

# Flap geometry is local to its hinge, so its rotation behaves physically.
flap_hinge = bpy.data.objects.new("Envelope flap physical hinge", None)
bpy.context.collection.objects.link(flap_hinge)
flap_hinge.location = (0, 1.98, 0.72)
flap_hinge.parent = envelope_root
flap = triangle("Upper cotton flap", [(-3.33,0,0),(3.33,0,0),(0,-3.48,0)], PAPER_LIGHT, 0.085, 0.042)
flap.parent = flap_hinge

# ----- Four-piece wax seal, with visible fracture seams -----
seal_center = (0, 0.16, 0.84)
angles = [math.radians(-8), math.radians(86), math.radians(178), math.radians(266), math.radians(352)]
fragments = []
for i in range(4):
    fragment = wax_sector(f"Wax seal fragment {i+1}", seal_center, 0.61, angles[i], angles[i+1], WAX)
    fragment.rotation_mode = "XYZ"
    fragments.append(fragment)

c_mark = text_obj("Embossed C", "C", (-0.18, 0.15, 0.945), 0.30, WAX_DARK)
r_mark = text_obj("Embossed R", "R", (0.20, 0.15, 0.945), 0.30, WAX_DARK)
star_mark = text_obj("Embossed star", "+", (0.01, 0.15, 0.948), 0.20, WAX_DARK)

# Seal holds, fractures upward, then pieces settle beside the envelope.
fragment_targets = [(-3.72,-1.38,-0.79),(-3.18,-1.72,-0.79),(3.16,-1.70,-0.79),(3.70,-1.36,-0.79)]
for i, (fragment, target) in enumerate(zip(fragments, fragment_targets)):
    key(fragment, 1, location=(0,0,0), rotation_euler=(0,0,0), scale=(1,1,1))
    key(fragment, 44, location=(0,0,0), rotation_euler=(0,0,0), scale=(1,1,1))
    key(fragment, 56, location=(target[0]*0.20,target[1]*0.12,0.16+0.025*i), rotation_euler=(math.radians(8+i*3),math.radians(-7+i*4),math.radians((-1)**i*7)), scale=(1,1,1))
    key(fragment, 74, location=target, rotation_euler=(math.radians(2),math.radians((-1)**i*3),math.radians((-1)**i*(15+i*4))), scale=(0.98,0.98,0.98))
    key(fragment, 192, location=target, rotation_euler=(math.radians(2),math.radians((-1)**i*3),math.radians((-1)**i*(15+i*4))), scale=(0.98,0.98,0.98))

for j, mark in enumerate((c_mark, star_mark, r_mark)):
    key(mark, 1, scale=(1,1,1)); key(mark, 44, scale=(1,1,1)); key(mark, 51+j, scale=(0.001,0.001,0.001)); key(mark, 192, scale=(0.001,0.001,0.001))

# Flap waits for the crack, springs free, overshoots, and settles.
key(flap_hinge, 1, rotation_euler=(0,0,0)); key(flap_hinge, 62, rotation_euler=(0,0,0))
key(flap_hinge, 82, rotation_euler=(math.radians(-72),0,0))
key(flap_hinge, 96, rotation_euler=(math.radians(-151),0,0))
key(flap_hinge, 105, rotation_euler=(math.radians(-140),0,0))
key(flap_hinge, 192, rotation_euler=(math.radians(-142),0,0))

# ----- A folded personal card inside the envelope -----
letter_root = bpy.data.objects.new("Personal letter root", None)
bpy.context.collection.objects.link(letter_root)
letter_root.rotation_mode = "XYZ"
lower_page = cube("Lower half of unfolding letter", (0, 0, 0), (2.83, 1.54, 0.045), PAPER_LIGHT, 0.065)
lower_edge = cube("Lower page deckled edge", (0, 0, -0.053), (2.88, 1.59, 0.018), PAPER_EDGE, 0.06)
lower_page.parent = letter_root
lower_edge.parent = letter_root

upper_hinge = bpy.data.objects.new("Letter center fold hinge", None)
bpy.context.collection.objects.link(upper_hinge)
upper_hinge.location = (0, 1.54, 0.02)
upper_hinge.parent = letter_root
upper_page = cube("Upper half of unfolding letter", (0, -1.54, 0.06), (2.83, 1.54, 0.04), PAPER_LIGHT, 0.065)
upper_page.parent = upper_hinge

# Cover typography visible while the card emerges.
cover_for = text_obj("Letter cover small line", "FOR", (0, 0.48, 0.115), 0.18, GOLD, extrude=0.002, font=GEORGIA)
cover_name = text_obj("Letter cover Rochel", "ROCHEL", (0, 0.04, 0.118), 0.52, CORAL_INK, extrude=0.0025, font=GEORGIA)
cover_date = text_obj("Letter cover date", "AUGUST 04", (0, -0.65, 0.116), 0.15, INK, extrude=0.0015, font=GEORGIA)
cover_star = text_obj("Letter cover star", "*", (0, 0.76, 0.119), 0.30, GOLD, extrude=0.002, font=GEORGIA)
for obj in (cover_for, cover_name, cover_date, cover_star):
    obj.location.y -= 1.54
    obj.parent = upper_hinge

# The approved note is typeset across both halves of the unfolded card. The
# upper half is viewed from its reverse after the fold opens, so its text is
# rotated onto that paper face. Copy here mirrors src/content.ts exactly.
upper_copy = (
    ("Inner salutation", "Dear Rochel,", -2.35, 0.31, CORAL_INK, CHANCERY),
    ("Inner opening line one", "Happy birthday. It’s crazy that we’ve", -1.86, 0.15, INK, GEORGIA),
    ("Inner opening line two", "gone from essentially being kids when", -1.46, 0.15, INK, GEORGIA),
    ("Inner opening line three", "we got married to now having two of", -1.06, 0.15, INK, GEORGIA),
    ("Inner opening line four", "our own.", -0.66, 0.15, INK, GEORGIA),
)
upper_letter_objects = []
for name, copy, y, size, material, font in upper_copy:
    obj = text_obj(name, copy, (-2.20, y, -0.155), size, material, "LEFT", 0.001, font)
    obj.rotation_euler[0] = math.pi
    obj.parent = upper_hinge
    key(obj, 1, scale=(0.001,0.001,0.001)); key(obj, 148, scale=(0.001,0.001,0.001)); key(obj, 160, scale=(1,1,1)); key(obj, 192, scale=(1,1,1))
    upper_letter_objects.append(obj)

lower_copy = (
    ("Inner body line one", "You are such an amazing human, wife,", 1.13),
    ("Inner body line two", "and mother to our kids. I have a tremendous", 0.85),
    ("Inner body line three", "amount of admiration and respect for", 0.57),
    ("Inner body line four", "everything you manage to juggle in your life.", 0.29),
    ("Inner birthday line one", "Mazel tov on turning 25. I look forward to", -0.08),
    ("Inner birthday line two", "spending many more birthdays together.", -0.36),
)
lower_letter_objects = []
for name, copy, y in lower_copy:
    obj = text_obj(name, copy, (-2.20, y, 0.123), 0.145, INK, "LEFT", 0.001, GEORGIA)
    obj.parent = letter_root
    lower_letter_objects.append(obj)

love = text_obj("Inner closing", "Love,", (-2.20, -0.73, 0.124), 0.16, INK, "LEFT", 0.001, GEORGIA)
signature = text_obj("Inner letter signature", "Cheskie", (-1.76, -1.02, 0.125), 0.34, CORAL_INK, "LEFT", 0.0015, CHANCERY)
postscript = text_obj("Inner postscript", "P.S. This letter was written by me, not the AI lol.", (-2.20, -1.33, 0.124), 0.105, INK, "LEFT", 0.001, GEORGIA_ITALIC)
gold_rule = curve("Fine gold letterpress rule", [(-2.20,-0.56,0.122),(-1.18,-0.56,0.122)], GOLD, 0.007)
signature_rule = curve("Signature finishing stroke", [(-1.86,-1.16,0.122),(-0.58,-1.16,0.122)], CORAL_INK, 0.006)
lower_letter_objects.extend((love, signature, postscript, gold_rule, signature_rule))
for obj in lower_letter_objects:
    if obj.parent is None:
        obj.parent = letter_root
    key(obj, 1, scale=(0.001,0.001,0.001)); key(obj, 156, scale=(0.001,0.001,0.001)); key(obj, 166, scale=(1,1,1)); key(obj, 192, scale=(1,1,1))

# The folded card remains tucked away, rises out, then unfolds toward the top.
key(letter_root, 1, location=(0,0.36,0.43), rotation_euler=(0,0,0), scale=(1,1,1))
key(letter_root, 96, location=(0,0.36,0.43), rotation_euler=(0,0,0), scale=(1,1,1))
key(letter_root, 116, location=(0,-0.08,0.88), rotation_euler=(math.radians(-2),0,math.radians(-0.7)), scale=(1,1,1))
key(letter_root, 138, location=(0,-2.10,1.40), rotation_euler=(math.radians(-5),0,math.radians(-2.2)), scale=(1,1,1))
key(letter_root, 154, location=(0,-2.25,1.56), rotation_euler=(math.radians(-7),0,0), scale=(1,1,1))
key(letter_root, 176, location=(0,-1.68,1.72), rotation_euler=(math.radians(-4),0,0), scale=(1.04,1.04,1.04))
key(letter_root, 192, location=(0,-1.45,2.05), rotation_euler=(0,0,0), scale=(1.15,1.15,1.15))

key(upper_hinge, 1, rotation_euler=(0,0,0)); key(upper_hinge, 142, rotation_euler=(0,0,0))
key(upper_hinge, 164, rotation_euler=(math.radians(-184),0,0))
key(upper_hinge, 173, rotation_euler=(math.radians(-176),0,0))
key(upper_hinge, 192, rotation_euler=(math.radians(-180),0,0))

# Cover type vanishes exactly as the card opens, exposing the real inner copy.
for obj in (cover_for, cover_name, cover_date, cover_star):
    key(obj, 1, scale=(1,1,1)); key(obj, 150, scale=(1,1,1)); key(obj, 160, scale=(0.001,0.001,0.001)); key(obj, 192, scale=(0.001,0.001,0.001))

# Dust motes catch the moving key light without ever becoming confetti.
for i in range(38):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(0.008, 0.022), location=(random.uniform(-5.2,5.2),random.uniform(-3.8,3.8),random.uniform(1.0,5.0)))
    mote = bpy.context.object
    mote.name = f"Window-light dust mote {i:02d}"
    mote.data.materials.append(DUST)
    x, y, z = mote.location
    key(mote, 1, location=(x,y,z), scale=(0.5,0.5,0.5))
    key(mote, 192, location=(x+random.uniform(-0.5,0.5),y+random.uniform(0.3,1.1),z+random.uniform(0.5,1.7)), scale=(0.8,0.8,0.8))

# ----- Lighting: window key, pocket glow, cool bounce, and moving caustic -----
bpy.ops.object.light_add(type="AREA", location=(-4.6,-4.2,8.8))
window = bpy.context.object
window.name = "Large late afternoon window"
window.data.energy = 1220
window.data.shape = "RECTANGLE"
window.data.size = 5.8
window.data.size_y = 4.2
window.data.color = (1.0,0.58,0.34)
look_at(window, (0,0,0.4))

bpy.ops.object.light_add(type="AREA", location=(4.8,1.8,6.2))
fill = bpy.context.object
fill.name = "Cool room bounce"
fill.data.energy = 360
fill.data.size = 5.0
fill.data.color = (0.57,0.70,1.0)
look_at(fill, (0,-0.4,0.4))

bpy.ops.object.light_add(type="POINT", location=(0,0.75,1.05))
pocket_glow = bpy.context.object
pocket_glow.name = "Warm light released by opening flap"
pocket_glow.data.color = (1.0,0.19,0.055)
pocket_glow.data.shadow_soft_size = 1.25
pocket_glow.data.energy = 0
pocket_glow.data.keyframe_insert("energy", frame=65)
pocket_glow.data.energy = 240
pocket_glow.data.keyframe_insert("energy", frame=94)
pocket_glow.data.energy = 85
pocket_glow.data.keyframe_insert("energy", frame=128)
pocket_glow.data.energy = 0
pocket_glow.data.keyframe_insert("energy", frame=176)

bpy.ops.object.light_add(type="AREA", location=(0,5.6,4.2))
rim = bpy.context.object
rim.name = "Paper edge rim"
rim.data.energy = 510
rim.data.size = 3.8
rim.data.color = (1.0,0.32,0.13)
look_at(rim, (0,0.8,0.7))

# ----- Camera choreography and focus pulls -----
bpy.ops.object.empty_add(type="PLAIN_AXES", location=seal_center)
focus = bpy.context.object
focus.name = "Cinematic focus pull target"
key(focus, 1, location=seal_center)
key(focus, 58, location=(0,0.10,0.92))
key(focus, 95, location=(0,0.80,0.80))
key(focus, 127, location=(0,-0.90,1.12))
key(focus, 160, location=(0,-1.25,1.72))
key(focus, 192, location=(0,-1.45,2.05))

bpy.ops.object.camera_add(location=(0,-8.20,5.85))
camera = bpy.context.object
camera.name = "Birthday letter cinematic camera"
scene.camera = camera
camera.data.dof.use_dof = True
camera.data.dof.focus_object = focus
camera.data.dof.aperture_fstop = 3.6
camera.rotation_mode = "XYZ"

camera_keys = [
    (1,  (0.18,-7.10,4.72), 76, (0,0.15,0.78)),
    (26, (-0.12,-6.58,4.22), 82, (0,0.15,0.80)),
    (54, (0.08,-6.30,4.05), 86, (0,0.12,0.90)),
    (74, (-0.18,-7.25,5.32), 70, (0,0.10,0.70)),
    (102,(0.12,-8.52,7.24), 62, (0,0.20,0.68)),
    (126,(-0.22,-8.10,7.08), 65, (0,-0.55,1.05)),
    (150,(0.10,-8.02,7.05), 58, (0,-2.02,1.46)),
    (170,(0.00,-9.00,8.50), 62 if MOBILE_MODE else 38, (0,-0.18,1.70)),
    (184,(0.00,-9.20,8.70), 62 if MOBILE_MODE else 38, (0,-0.18,1.70)),
    (192,(0.00,-9.20,8.70), 62 if MOBILE_MODE else 38, (0,-0.18,1.70)),
]
for frame, loc, lens, target in camera_keys:
    camera.location = loc
    camera.data.lens = lens
    look_at(camera, target)
    camera.keyframe_insert("location", frame=frame)
    camera.keyframe_insert("rotation_euler", frame=frame)
    camera.data.keyframe_insert("lens", frame=frame)

# A restrained focus pull: macro seal, readable envelope, intimate inner note.
for frame, fstop in ((1,3.2),(54,2.8),(92,4.8),(126,4.2),(156,3.6),(192,5.6)):
    camera.data.dof.aperture_fstop = fstop
    camera.data.dof.keyframe_insert("aperture_fstop", frame=frame)

scene.frame_set(1)
blend_path = os.path.join(ROOT, "blender", "rochel-envelope-cinematic.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

if "--preview" in sys.argv:
    original_percentage = scene.render.resolution_percentage
    scene.render.resolution_percentage = 60
    for frame in (1, 48, 82, 112, 144, 170, 188):
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(PREVIEW, f"preview-{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
    scene.render.resolution_percentage = original_percentage

if "--preview-mobile" in sys.argv:
    scene.render.resolution_x = 720
    scene.render.resolution_y = 1280
    scene.render.resolution_percentage = 60
    camera.data.sensor_fit = "HORIZONTAL"
    for frame in (112, 170, 188):
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(PREVIEW, f"mobile-preview-{frame:03d}.png")
        bpy.ops.render.render(write_still=True)

if "--render" in sys.argv:
    scene.render.filepath = os.path.join(OUT, "frame-")
    bpy.ops.render.render(animation=True)

if "--render-mobile" in sys.argv:
    # Preserve horizontal composition in portrait rather than cropping the
    # personalized typography and inner letter at phone widths.
    scene.render.resolution_x = 720
    scene.render.resolution_y = 1280
    camera.data.sensor_fit = "HORIZONTAL"
    scene.render.filepath = os.path.join(MOBILE_OUT, "frame-")
    bpy.ops.render.render(animation=True)

if "--render-letter-desktop" in sys.argv:
    for frame in range(96, 193):
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(OUT, f"frame-{frame:04d}.png")
        bpy.ops.render.render(write_still=True)

if "--render-letter-mobile" in sys.argv:
    scene.render.resolution_x = 720
    scene.render.resolution_y = 1280
    camera.data.sensor_fit = "HORIZONTAL"
    for frame in range(96, 193):
        scene.frame_set(frame)
        scene.render.filepath = os.path.join(MOBILE_OUT, f"frame-{frame:04d}.png")
        bpy.ops.render.render(write_still=True)
