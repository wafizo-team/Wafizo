# ─── Providers ───────────────────────────────────────────────────────────────

provider "ovh" {
  endpoint           = var.ovh_endpoint
  application_key    = var.ovh_application_key
  application_secret = var.ovh_application_secret
  consumer_key       = var.ovh_consumer_key
}

provider "openstack" {
  user_name   = var.openstack_user
  password    = var.openstack_password
  tenant_name = var.openstack_tenant_name
  auth_url    = "https://auth.cloud.ovh.net/v3"
  region      = var.openstack_region
}

# ─── Keypair SSH ─────────────────────────────────────────────────────────────

resource "openstack_compute_keypair_v2" "wafizo_key" {
  name       = var.ssh_key_name
  public_key = file(var.ssh_public_key_path)
}

# ─── Security Group ──────────────────────────────────────────────────────────

data "openstack_networking_secgroup_v2" "default_sg" {
  name = "default"
}


# ─── Image + Flavor ──────────────────────────────────────────────────────────

data "openstack_images_image_v2" "debian" {
  name        = var.instance_image
  most_recent = true
}

data "openstack_compute_flavor_v2" "b3_8" {
  name = var.instance_flavor
}

# ─── Instance ────────────────────────────────────────────────────────────────

resource "openstack_compute_instance_v2" "wafizo" {
  name            = var.instance_name
  image_id        = data.openstack_images_image_v2.debian.id
  flavor_id       = data.openstack_compute_flavor_v2.b3_8.id
  key_pair        = openstack_compute_keypair_v2.wafizo_key.name
  security_groups = [data.openstack_networking_secgroup_v2.default_sg.name]

  network {
    name = "Ext-Net"
  }

  user_data = <<-EOT
    #!/bin/bash
    hostnamectl set-hostname wafizo-prod
    apt-get update -q
    apt-get install -y -q python3
  EOT

  metadata = {
    project = "wafizo"
    env     = "prod"
  }
}

# ─── Volume données ───────────────────────────────────────────────────────────

resource "openstack_blockstorage_volume_v3" "wafizo_data" {
  name        = "wafizo-prod-data"
  size        = 30
  description = "Données persistantes : PostgreSQL, volumes K3s, logs"
}

resource "openstack_compute_volume_attach_v2" "wafizo_data_attach" {
  instance_id = openstack_compute_instance_v2.wafizo.id
  volume_id   = openstack_blockstorage_volume_v3.wafizo_data.id
}
