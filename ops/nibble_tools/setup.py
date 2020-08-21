from setuptools import setup

setup(
    name="nibble_tools",
    version="1.0",
    description="Tools for Nibble",
    url="https://github.com/nibble-club/nibble",
    author="Nibble",
    license="MIT",
    packages=["nibble_tools"],
    install_requires=["wheel", "boto3", "Click"],
    entry_points="""
        [console_scripts]
        aws_mfa=nibble_tools.aws_mfa:cli
    """,
    zip_safe=False,
)
