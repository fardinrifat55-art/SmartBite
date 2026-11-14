from PIL import Image, ImageEnhance, ImageOps

im = Image.open('/home/z/my-project/upload/pasted_image_1794655916700.png').convert('RGB')
w, h = im.size
print('original:', im.size)

# Brightest, most salad-like region sits around the middle-left band.
# Crop a wide short strip from ~y=120 to y=300 (middle band with bowls).
target_ratio = 2.4
crop_w = w
crop_h = int(crop_w / target_ratio)
top = 120  # middle band — brighter, more salad content
box = (0, top, crop_w, top + crop_h)
crop = im.crop(box)
if crop.size[1] > h:
    crop_h = h - top
    crop = im.crop((0, top, crop_w, h))
print('crop:', crop.size)

# Strong brighten + saturate to read as fresh salad
crop = ImageEnhance.Brightness(crop).enhance(1.45)
crop = ImageEnhance.Color(crop).enhance(1.35)
crop = ImageEnhance.Contrast(crop).enhance(1.08)

# Auto-contrast to lift the dark stone background
crop = ImageOps.autocontrast(crop, cutoff=4)

crop.save('/home/z/my-project/public/salad-bowl-wide.png', optimize=True)

# verify brightness
px = crop.resize((20,8))
vals = list(px.getdata())
avg = sum(sum(p) for p in vals)/(len(vals)*3)
print('new avg brightness:', round(avg,1), 'size:', crop.size)
