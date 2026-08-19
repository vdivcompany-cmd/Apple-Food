import urllib.request
import json
from pathlib import Path

screens = [
    {
        "id": "0cbd0e5bc2524016a3bfedfede29e8b3",
        "name": "active-chat-desktop",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTY0YjQ5YzQyYzMwNWYxM2NmNzFkMGU5YzQ2EgsSBxCjk734jAYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzcxMTIzMTA2MDkwNDE1ODA1Nw&filename=&opi=89354086",
        "screenshot": "https://lh3.googleusercontent.com/aida/AP1WRLsFN5Kaw3kD08JJ4iAq-qx2ejPM3vXfKzPfFPeFx9z7dHlK6qeRHHMVsUgJefIX1xKoPQeLSNFDkhHn-M3xvjj3v4KRW4MNj54jMHoiKxpyFcJxACVpVPOI6REsB2oxVGNinUZKIIl7Uu-QnTWNzR20JfZqSN1yiigOh59DTAChYo9B4SyVh9qOlaau_4Ni1Kg-5kwZL48l0MOPdd4nRbliYY-Fe14-bWpXWn5fDC7gerQT5RlnPqJSYpsf"
    },
    {
        "id": "44b4085b4ac24378a4b577bb78644de3",
        "name": "welcome-desktop",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTY0YjM2NTgwNTEwNGU3NGQ5YWI2MGFhOWI1EgsSBxCjk734jAYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzcxMTIzMTA2MDkwNDE1ODA1Nw&filename=&opi=89354086",
        "screenshot": "https://lh3.googleusercontent.com/aida/AP1WRLuwOtzIFfLMG7VGzvsMHbQUjFU5HB3CoLOunqd9UH5zU8sRD9Y5Mu3T8NhGVgyTltiBmjGOndNngybfJbynhGeQX2sagd59mjBfgJcavvlUYwOIxNR2nshNqMXzhvBw7AxRqc7Ug6dp7Q0rJRaO8h7q9_BTqeJdNwa5ki6o33nAh8RrsjrpglUjiVcnuMCi4f0ysQFDGLbUmeAEEksEOsLg7Dq3uDdV6mVW_QvAa-La-AXkVhu8AE_PIjLS"
    },
    {
        "id": "8985cd179b5e42f28399cf81a8a24425",
        "name": "active-chat-mobile",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTY0YjQ0M2M4OGMwNGU3NGJkZDVkMDYzOWFjEgsSBxCjk734jAYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzcxMTIzMTA2MDkwNDE1ODA1Nw&filename=&opi=89354086",
        "screenshot": "https://lh3.googleusercontent.com/aida/AP1WRLsMOMVPwwSt3qSeuecsHu456oDpYMocBUP2-UQv_xfq5vaDWGfOBlZHc1lshwMkiUaW0eHEOEe2wOUKlreNbB3DWWTiJBB0Qv1304OvIsbpy2MLvNlmOa7pQYzuYGrIEWu0DsYvLgEJk2kLOXHTkXm22W0xR4Hq-7iA6ExLcWtfOncbOME6qn-20K0DBA2TaEX2j-0CRYdBgP5bVayuZEl9ahCw9A2UY9ZZ4sAt2vXtFPsmiKKkGF1zrmo"
    },
    {
        "id": "7c942cd2e07346ed85471e3dcacfdba1",
        "name": "order-tracking-mobile",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTY0YjNkODEyZWIwMjNiZWJlYTA0MTg2YmFhEgsSBxCjk734jAYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzcxMTIzMTA2MDkwNDE1ODA1Nw&filename=&opi=89354086",
        "screenshot": "https://lh3.googleusercontent.com/aida/AP1WRLuBUP7nUFWnNRVyYgNgU1fhBZBxRa-cv45_IB8c0b3XRGAZ3CP5H4pZzrQXXdUEJFGei3pXb-VRkWC7g8l3-tpfF9B6uG8CHEPe9tP-YXI8MYH6cLsPwCIiSVwqs0LMraA3tFKLPje26q00G8b9Jb0AjWP2LLG9qq2za08vSS_dpvcNW8Cjh9nArN_PaGDriZcTNw63Z9sj0VLuX7JzO8JBmxooayBmiU8M11G2s9RUH8urof3E2BbJtTQ"
    },
    {
        "id": "6885bc35e3e542f69d85bed6e358fd4f",
        "name": "session-expired",
        "html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1OTY0YjMxYTViZDgwMjNiZWJlYTA0MTg2YmFhEgsSBxCjk734jAYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNzcxMTIzMTA2MDkwNDE1ODA1Nw&filename=&opi=89354086",
        "screenshot": "https://lh3.googleusercontent.com/aida/AP1WRLtrAi1eqa2aANJGlh0rbLb-_3KbBuv951E8H5tKaaRJPBbMkOjegmHk4bMJQl-KHB6h45CovJ9312DLg4VLNAm4g8YCr037lnoP8Cr_03L2TuWfOZlkmX1JPUu_8GYaS06NKmMgvgHBrZmwqlewICAg3ApzM9RJLjs2MTzVrruw457nadJOKOmIXasCKek3J0cRowU42mYDuNr9iskM-eXp9hRppI_PuRK0-xo3hrmO1bfWiYNGBGUzsZU"
    }
]

out_screens = Path("stitch-assets/screens")
out_images = Path("stitch-assets/images")

for s in screens:
    print(f"Downloading {s['name']}...")
    # HTML
    html_path = out_screens / f"{s['name']}.html"
    try:
        req = urllib.request.Request(s['html'], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(html_path, 'wb') as f:
            f.write(resp.read())
        print(f"  [OK] HTML -> {html_path}")
    except Exception as e:
        print(f"  [ERR] HTML: {e}")

    # Screenshot
    img_path = out_images / f"{s['name']}.png"
    try:
        req = urllib.request.Request(s['screenshot'], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(img_path, 'wb') as f:
            f.write(resp.read())
        print(f"  [OK] Image -> {img_path}")
    except Exception as e:
        print(f"  [ERR] Image: {e}")

print("Download complete!")
